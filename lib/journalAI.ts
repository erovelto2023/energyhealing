import { generateText } from './ollama'

export interface JournalAnalysis {
    emotionalSummary: string
    energyInterpretation: string
    patterns: string[]
    affirmations: string[]
    recommendations: string[]
    microAction: string
}

/**
 * Analyze a journal entry for emotional content and provide healing insights
 */
export async function analyzeJournalEntry(
    content: string,
    mood?: string,
    emotions?: string[],
    energyLevel?: number
): Promise<JournalAnalysis> {
    const prompt = `You are a compassionate, trauma-informed healing guide. Analyze this journal entry and provide supportive insights.

Journal Entry:
"${content}"

${mood ? `Current Mood: ${mood}` : ''}
${emotions && emotions.length > 0 ? `Emotions: ${emotions.join(', ')}` : ''}
${energyLevel ? `Energy Level: ${energyLevel}/10` : ''}

Provide a healing analysis in the following format:

EMOTIONAL SUMMARY:
[A compassionate 2-3 sentence summary of the emotional themes in this entry]

ENERGY INTERPRETATION:
[1-2 sentences about the person's energy state and what it might be asking for]

PATTERNS:
- [Pattern 1: Brief observation about recurring themes or behaviors]
- [Pattern 2: Another pattern if present]
- [Pattern 3: Another pattern if present]

AFFIRMATIONS:
- [Affirmation 1: Supportive, present-tense affirmation]
- [Affirmation 2: Another affirmation]
- [Affirmation 3: Another affirmation]

RECOMMENDATIONS:
- [Recommendation 1: Gentle healing practice or reflection]
- [Recommendation 2: Another recommendation]
- [Recommendation 3: Another recommendation]

MICRO-ACTION:
[One small, doable action they can take today - be specific and gentle]

IMPORTANT: Be trauma-aware, non-clinical, supportive, and gentle. Never diagnose. Focus on validation, self-compassion, and gentle healing.`

    try {
        const response = await generateText(prompt)

        // Sanitize response - remove markdown formatting like **
        const sanitizedResponse = response.replace(/\*\*/g, '')

        // Parse the AI response
        const analysis: JournalAnalysis = {
            emotionalSummary: '',
            energyInterpretation: '',
            patterns: [],
            affirmations: [],
            recommendations: [],
            microAction: ''
        }

        // Extract emotional summary
        const emotionalMatch = sanitizedResponse.match(/EMOTIONAL SUMMARY:([\s\S]+?)(?=ENERGY INTERPRETATION:|$)/i)
        if (emotionalMatch) {
            analysis.emotionalSummary = emotionalMatch[1].trim()
        }

        // Extract energy interpretation
        const energyMatch = sanitizedResponse.match(/ENERGY INTERPRETATION:([\s\S]+?)(?=PATTERNS:|$)/i)
        if (energyMatch) {
            analysis.energyInterpretation = energyMatch[1].trim()
        }

        // Extract patterns
        const patternsMatch = sanitizedResponse.match(/PATTERNS:([\s\S]+?)(?=AFFIRMATIONS:|$)/i)
        if (patternsMatch) {
            const patternLines = patternsMatch[1].trim().split('\n')
            analysis.patterns = patternLines
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.replace(/^-\s*/, '').trim())
                .filter(p => p.length > 0)
                .slice(0, 3)
        }

        // Extract affirmations
        const affirmationsMatch = sanitizedResponse.match(/AFFIRMATIONS:([\s\S]+?)(?=RECOMMENDATIONS:|$)/i)
        if (affirmationsMatch) {
            const affirmationLines = affirmationsMatch[1].trim().split('\n')
            analysis.affirmations = affirmationLines
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.replace(/^-\s*/, '').trim())
                .filter(a => a.length > 0)
                .slice(0, 3)
        }

        // Extract recommendations
        const recommendationsMatch = sanitizedResponse.match(/RECOMMENDATIONS:([\s\S]+?)(?=MICRO-ACTION:|$)/i)
        if (recommendationsMatch) {
            const recommendationLines = recommendationsMatch[1].trim().split('\n')
            analysis.recommendations = recommendationLines
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.replace(/^-\s*/, '').trim())
                .filter(r => r.length > 0)
                .slice(0, 3)
        }

        // Extract micro-action
        const microActionMatch = sanitizedResponse.match(/MICRO-ACTION:([\s\S]+?)$/i)
        if (microActionMatch) {
            analysis.microAction = microActionMatch[1].trim()
        }

        return analysis
    } catch (error) {
        console.error('Error analyzing journal entry:', error)
        throw new Error('Failed to analyze journal entry')
    }
}

/**
 * Generate AI-recommended journal prompts based on user's mood and history
 */
export async function suggestPrompts(
    mood?: string,
    recentTopics?: string[],
    emotionalThemes?: string[]
): Promise<string[]> {
    const prompt = `You are a compassionate healing guide. Suggest 3 journal prompts for someone who:

${mood ? `Current Mood: ${mood}` : ''}
${recentTopics && recentTopics.length > 0 ? `Recent Topics: ${recentTopics.join(', ')}` : ''}
${emotionalThemes && emotionalThemes.length > 0 ? `Emotional Themes: ${emotionalThemes.join(', ')}` : ''}

Provide 3 thoughtful, healing-focused journal prompts. Make them:
- Open-ended and reflective
- Trauma-aware and gentle
- Focused on self-discovery and healing
- Varied in depth (one light, one medium, one deep)

Format as a simple list:
1. [First prompt]
2. [Second prompt]
3. [Third prompt]`

    try {
        const response = await generateText(prompt)

        // Extract prompts from numbered list
        const promptMatches = response.match(/\d+\.\s*(.+?)(?=\n\d+\.|\n*$)/g)
        if (promptMatches) {
            return promptMatches
                .map(p => p.replace(/^\d+\.\s*/, '').trim())
                .filter(p => p.length > 0)
                .slice(0, 3)
        }

        return []
    } catch (error) {
        console.error('Error suggesting prompts:', error)
        return []
    }
}

/**
 * Identify patterns across multiple journal entries
 */
export async function identifyPatterns(entries: Array<{ content: string; mood?: string; date: Date }>): Promise<string[]> {
    if (entries.length < 3) {
        return [] // Need at least 3 entries to identify patterns
    }

    const entrySummaries = entries.map((entry, index) => {
        const date = entry.date.toLocaleDateString()
        return `Entry ${index + 1} (${date}): ${entry.content.substring(0, 200)}... [Mood: ${entry.mood || 'not specified'}]`
    }).join('\n\n')

    const prompt = `You are a compassionate healing guide analyzing journal entries over time. Identify recurring emotional patterns, themes, or behaviors.

Recent Journal Entries:
${entrySummaries}

Identify 2-3 key patterns you notice across these entries. Focus on:
- Recurring emotions or triggers
- Behavioral patterns
- Relationship themes
- Self-talk patterns
- Coping mechanisms

Format as a simple list:
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

Be gentle, non-judgmental, and focus on awareness rather than criticism.`

    try {
        const response = await generateText(prompt)

        // Extract patterns from bullet list
        const patternMatches = response.match(/-\s*(.+?)(?=\n-|\n*$)/g)
        if (patternMatches) {
            return patternMatches
                .map(p => p.replace(/^-\s*/, '').trim())
                .filter(p => p.length > 0)
                .slice(0, 3)
        }

        return []
    } catch (error) {
        console.error('Error identifying patterns:', error)
        return []
    }
}
