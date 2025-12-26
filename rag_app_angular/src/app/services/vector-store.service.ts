import { Injectable } from '@angular/core';
import { PersistenceService } from './persistence.service';

export interface DocumentEntry {
    id: string;
    title: string;
    content: string;
    embedding: number[];
    sourceId: string;
    dateAdded: number;
}

@Injectable({
    providedIn: 'root'
})
export class VectorStoreService {
    private documents: DocumentEntry[] = [];
    private isInitialized = false;

    constructor(private persistence: PersistenceService) { }

    async init(workspaceId: string = 'default') {
        await this.persistence.init(workspaceId);
        this.documents = await this.persistence.getAllDocuments();
        this.isInitialized = true;
    }

    async reloadWorkspace(workspaceId: string) {
        this.isInitialized = false;
        await this.init(workspaceId);
    }

    async addDocument(doc: DocumentEntry) {
        if (!this.isInitialized) await this.init();
        this.documents.push(doc);
        await this.persistence.saveDocuments(this.documents);
    }

    async deleteBySourceId(sourceId: string) {
        if (!this.isInitialized) await this.init();
        this.documents = this.documents.filter(d => d.sourceId !== sourceId);
        await this.persistence.saveDocuments(this.documents);
    }

    async deleteById(id: string) {
        if (!this.isInitialized) await this.init();
        this.documents = this.documents.filter(d => d.id !== id);
        await this.persistence.saveDocuments(this.documents);
    }

    getAllDocuments() {
        return this.documents;
    }

    async searchSimilar(queryEmbedding: number[], limit: number = 5): Promise<DocumentEntry[]> {
        if (!this.isInitialized) await this.init();
        if (this.documents.length === 0) return [];

        // Pure TypeScript Cosine Similarity - Lightning fast for thousands of vectors
        const results = this.documents.map(doc => ({
            doc,
            similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        // Sort by similarity descending
        results.sort((a, b) => b.similarity - a.similarity);

        return results.slice(0, limit).map(r => r.doc);
    }

    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async clearAll() {
        await this.persistence.clearAll();
        this.documents = [];
    }

    getPersistence() {
        return this.persistence;
    }
}
