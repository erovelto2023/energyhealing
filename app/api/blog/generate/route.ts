import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateWithOllamaStream } from '@/lib/ollama'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes timeout for long generation

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        // const userId = 'debug_user'

        const body = await req.json()
        const {
            primaryKeyword,
            secondaryKeywords,
            tone = 'conversational',
            length = '1500',
            additionalInstructions
        } = body

        if (!primaryKeyword) {
            return NextResponse.json({ error: 'Primary keyword is required' }, { status: 400 })
        }

        const prompt = `You are an expert SEO blog writer. Write a comprehensive, engaging, and SEO-optimized blog post.

**Requirements:**
1. **Primary Keyword**: "${primaryKeyword}"
   - Must appear in the first paragraph.
   - Must appear in at least one H2 subheading.
   - Must be used naturally throughout the text.

2. **Secondary Keywords**: ${secondaryKeywords || 'None provided'}
   - Sprinkle these naturally throughout the content.
   - Do not force them; ensure they fit the context.

3. **Tone**: ${tone}
4. **Length**: Approximately ${length} words.
5. **Structure**:
   - **Title**: Catchy and includes the primary keyword (wrap in <h1>).
   - **Introduction**: Engaging hook, introduces the topic and primary keyword.
   - **Body**: Organized with <h2> and <h3> subheadings. Use bullet points (<ul><li>) or numbered lists (<ol><li>) where helpful. Break text into short, readable paragraphs (<p>).
   - **Conclusion**: Summary and optional Call to Action (CTA).
   - **FAQ**: Optional FAQ section using schema-ready formatting if relevant.

6. **Formatting**:
   - **STRICTLY** use semantic HTML tags.
   - Use <h1> for the main title.
   - Use <h2> for main sections.
   - Use <h3> for subsections.
   - Use <p> for paragraphs.
   - Use <ul> and <ol> with <li> for lists.
   - Use <blockquote> for key quotes or takeaways.
   - Use <strong> for emphasis.
   - Use <em> for subtle emphasis.
   - **DO NOT** use Markdown (like **bold**, # Header, or - list).
   - **DO NOT** include \`\`\`html code blocks. Just return the raw HTML string.
   - **DO NOT** include <html>, <head>, or <body> tags.

**Additional Instructions**:
${additionalInstructions || 'None'}

**Output Format**:
Return ONLY the raw HTML content. Start directly with the <h1> tag. Do not include "Here is your blog post", "Thinking...", or any other conversational text. Do not wrap the output in a code block.`

        console.log('Starting stream generation...')

        try {
            const stream = await generateWithOllamaStream(prompt, 'deepseek-r1:latest')
            console.log('Stream obtained from Ollama')

            // Create a transform stream to parse the Ollama JSON chunks and extract the response text
            const textStream = new TransformStream({
                async transform(chunk, controller) {
                    const text = new TextDecoder().decode(chunk)

                    // Ollama sends multiple JSON objects in one chunk sometimes
                    const lines = text.split('\n').filter(line => line.trim() !== '')

                    for (const line of lines) {
                        try {
                            const json = JSON.parse(line)
                            // Only send the response field, ignore thinking field
                            if (json.response) {
                                controller.enqueue(new TextEncoder().encode(json.response))
                            }
                        } catch (e) {
                            // Ignore parse errors for partial lines
                        }
                    }
                }
            })

            return new Response(stream.pipeThrough(textStream), {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8'
                }
            })
        } catch (streamError) {
            console.error('Error getting stream from Ollama:', streamError)
            throw streamError // Re-throw to be caught by outer catch
        }

    } catch (error) {
        console.error('Error generating blog post:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 })
    }
}
