'use client'

import { useState, useCallback } from 'react'

export interface OllamaResponse {
    response: string
    model: string
    created_at: string
    done: boolean
}

export interface UseOllamaOptions {
    onStart?: () => void
    onSuccess?: (data: OllamaResponse) => void
    onError?: (error: Error) => void
}

export function useOllama(options?: UseOllamaOptions) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [response, setResponse] = useState<OllamaResponse | null>(null)

    const generate = useCallback(async (prompt: string, model: string = 'deepseek-r1:latest') => {
        setIsLoading(true)
        setError(null)
        options?.onStart?.()

        try {
            const res = await fetch('/api/ollama', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model, stream: false })
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.details || errorData.error || 'Failed to generate response')
            }

            const data: OllamaResponse = await res.json()
            setResponse(data)
            options?.onSuccess?.(data)
            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error')
            setError(error)
            options?.onError?.(error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [options])

    const reset = useCallback(() => {
        setIsLoading(false)
        setError(null)
        setResponse(null)
    }, [])

    return {
        generate,
        reset,
        isLoading,
        error,
        response
    }
}
