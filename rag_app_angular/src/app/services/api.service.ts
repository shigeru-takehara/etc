import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    async getEmbedding(text: string, baseUrl: string, model: string): Promise<number[]> {
        const response = await fetch(`${baseUrl}/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: text, model })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Embedding failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (data.data && data.data[0] && data.data[0].embedding) {
            return data.data[0].embedding;
        }
        throw new Error('Invalid embedding response format');
    }

    async getChatCompletion(options: {
        prompt: string;
        context: string[];
        baseUrl: string;
        model: string;
        apiKey?: string;
        temperature?: number;
    }): Promise<string> {
        const { prompt, context, baseUrl, model, apiKey, temperature } = options;

        const messages = [
            {
                role: 'system',
                content: `You are a helpful RAG Assistant. Use the following context to answer the user's question. Context: ${context.join('\n\n')}`
            },
            { role: 'user', content: prompt }
        ];

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
            },
            body: JSON.stringify({
                model,
                messages,
                ...(temperature !== undefined ? { temperature } : {})
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Chat completion failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async testConnection(baseUrl: string, apiKey?: string): Promise<boolean> {
        try {
            const response = await fetch(`${baseUrl}/models`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
                }
            });
            return response.ok;
        } catch (e) {
            console.error('Connection failed:', e);
            return false;
        }
    }
}
