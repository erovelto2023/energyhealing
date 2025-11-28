// Ollama utility functions for server-side API calls
import { spawn } from 'child_process'
import { Readable } from 'stream'

const OLLAMA_BASE_URL = process.env.OLLAMA_API_URL || 'http://31.97.146.3:11434'

export interface OllamaGenerateRequest {
    model: string
    prompt: string
    stream?: boolean
    options?: {
        temperature?: number
        top_p?: number
        num_predict?: number
    }
}

export interface OllamaGenerateResponse {
    model: string
    created_at: string
    response: string
    done: boolean
    context?: number[]
    total_duration?: number
    load_duration?: number
    prompt_eval_count?: number
    eval_count?: number
    eval_duration?: number
}

export interface OllamaModel {
    name: string
    modified_at: string
    size: number
    digest: string
}

/**
 * Generate text with Ollama
 */
export async function generateWithOllama(
    prompt: string,
    model: string = 'deepseek-r1:latest',
    options?: OllamaGenerateRequest['options']
): Promise<OllamaGenerateResponse> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'close'
        },
        body: JSON.stringify({
            model,
            prompt,
            stream: false,
            options: options || {}
        })
    })

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
}

/**
 * List available Ollama models
 */
export async function listOllamaModels(): Promise<OllamaModel[]> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.models || []
}

/**
 * Generate personalized affirmations
 */
export async function generateAffirmations(
    mood: string,
    challenge?: string,
    model: string = 'deepseek-r1:latest'
): Promise<string[]> {
    const prompt = `You are a compassionate energy healer. Create exactly 3 personalized affirmations for someone feeling ${mood}${challenge ? ` and dealing with ${challenge}` : ''}.

Make each affirmation:
- In first person ("I am...", "I have...", "I trust...")
- Empowering and uplifting
- 5-12 words each

Return ONLY the 3 affirmations, one per line, numbered 1-3. No other text.`

    const response = await generateWithOllama(prompt, model)

    // Parse affirmations from response
    const lines = response.response.split('\n').filter(line => line.trim())
    const affirmations = lines
        .filter(line => /^\d+[\.\)]\s/.test(line.trim()))
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .slice(0, 3)

    // Fallback if parsing fails
    if (affirmations.length === 0) {
        return [
            'I am worthy of peace and healing',
            'I trust my inner wisdom to guide me',
            'I embrace this moment with compassion'
        ]
    }

    return affirmations
}

/**
 * Simplified wrapper to get just the text response
 */
export async function generateText(prompt: string, model?: string): Promise<string> {
    const result = await generateWithOllama(prompt, model)
    return result.response
}

/**
 * Generate text with Ollama (Streaming)
 */
export async function generateWithOllamaStream(
    prompt: string,
    model: string = 'deepseek-r1:latest',
    options?: OllamaGenerateRequest['options']
): Promise<ReadableStream<Uint8Array>> {
    console.log('Spawning curl.exe for Ollama...');

    const child = spawn('curl.exe', [
        '-v', // verbose required for some reason on Windows to flush stdout?
        '-N', // no buffer
        '-X', 'POST',
        `${OLLAMA_BASE_URL}/api/generate`,
        '-H', 'Content-Type: application/json',
        '-d', JSON.stringify({
            model,
            prompt,
            stream: true,
            options: options || {}
        })
    ], {});

    child.stderr.on('data', (data) => {
        console.log('curl stderr:', data.toString());
    });

    child.on('error', (err) => {
        console.error('Failed to start curl:', err);
    });

    // @ts-ignore
    return new ReadableStream({
        start(controller) {
            child.stdout.on('data', (chunk) => {
                controller.enqueue(chunk);
            });
            child.stdout.on('end', () => {
                controller.close();
            });
            child.stdout.on('error', (err) => {
                controller.error(err);
            });
        },
        cancel() {
            child.kill();
        }
    });
}
