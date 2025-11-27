// Chakra analysis utility function for Ollama

import { generateWithOllama } from './ollama'

export interface ChakraAnalysis {
    chakra: string
    analysis: string
    recommendations: string[]
}

/**
 * Analyze chakra imbalances based on symptoms
 */
export async function analyzeChakras(
    symptoms: string[],
    model: string = 'deepseek-r1:latest'
): Promise<ChakraAnalysis[]> {
    const prompt = `You are an expert in chakra healing and energy work. Analyze these symptoms and identify which chakras are imbalanced:

Symptoms: ${symptoms.join(', ')}

For each imbalanced chakra (identify 1-3 chakras), provide:
1. Chakra name (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, or Crown)
2. Brief analysis (2-3 sentences) explaining why this chakra is imbalanced based on the symptoms
3. Exactly 3 specific, actionable healing recommendations

Format your response EXACTLY like this for each chakra:

CHAKRA: [Name]
ANALYSIS: [Your 2-3 sentence analysis]
RECOMMENDATIONS:
1. [First recommendation]
2. [Second recommendation]
3. [Third recommendation]

Analyze 1-3 chakras maximum. Be specific and practical.`

    const response = await generateWithOllama(prompt, model)

    // Parse the response
    const chakraBlocks = response.response.split('CHAKRA:').filter(block => block.trim())

    const analyses: ChakraAnalysis[] = []

    for (const block of chakraBlocks.slice(0, 3)) {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line)

        // Extract chakra name (first line)
        const chakraName = lines[0].replace(/^:\s*/, '').trim()

        // Extract analysis
        const analysisMatch = block.match(/ANALYSIS:\s*([\s\S]+?)(?=RECOMMENDATIONS:|$)/)
        const analysis = analysisMatch ? analysisMatch[1].trim() : ''

        // Extract recommendations
        const recommendationsMatch = block.match(/RECOMMENDATIONS:\s*([\s\S]+?)(?=CHAKRA:|$)/)
        const recommendations: string[] = []

        if (recommendationsMatch) {
            const recText = recommendationsMatch[1]
            const recLines = recText.split('\n').filter(line => line.trim())

            for (const line of recLines) {
                const cleaned = line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim()
                if (cleaned && cleaned.length > 10) {
                    recommendations.push(cleaned)
                }
            }
        }

        if (chakraName && analysis && recommendations.length > 0) {
            analyses.push({
                chakra: chakraName,
                analysis,
                recommendations: recommendations.slice(0, 3)
            })
        }
    }

    // Fallback if parsing fails
    if (analyses.length === 0) {
        return [{
            chakra: 'Root',
            analysis: 'Based on your symptoms, your root chakra may need attention for grounding and stability.',
            recommendations: [
                'Practice grounding exercises like walking barefoot',
                'Use root chakra affirmations daily',
                'Eat root vegetables and protein-rich foods'
            ]
        }]
    }

    return analyses
}
