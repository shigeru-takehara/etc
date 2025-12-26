import { Injectable, signal, effect, computed } from '@angular/core';
import { ApiService } from './api.service';
import { ChunkingService } from './chunking.service';
import { FileIngestionService } from './file-ingestion.service';
import { VectorStoreService, DocumentEntry } from './vector-store.service';
import { PersistenceService, Workspace } from './persistence.service';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface RagConfig {
    baseUrl: string;
    chatModel: string;
    embeddingModel?: string;
    apiKey?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RagService {
    // Reactive state using Signals
    documents = signal<DocumentEntry[]>([]);
    messages = signal<Message[]>([]);
    workspaces = signal<Workspace[]>([]);
    activeWorkspace = signal<Workspace | null>(null);
    isProcessing = signal(false);
    isChunkingEnabled = signal(true);
    topK = signal(5);
    useCloud = signal(false);

    localConfig = signal<RagConfig>({
        baseUrl: 'http://localhost:1234/v1',
        chatModel: 'llama-3.2-3b-instruct',
        embeddingModel: 'text-embedding-nomic-embed-text-v1.5@q4_k_m'
    });

    cloudConfig = signal<RagConfig>({
        baseUrl: 'https://api.openai.com/v1',
        chatModel: 'gpt-4o-mini',
        apiKey: ''
    });

    constructor(
        private apiService: ApiService,
        private chunkingService: ChunkingService,
        private fileService: FileIngestionService,
        private vectorStore: VectorStoreService,
        private persistence: PersistenceService
    ) {
        this.init();

        // Auto-save configs when they change
        effect(() => {
            localStorage.setItem('local_config_ng', JSON.stringify(this.localConfig()));
        });
        effect(() => {
            localStorage.setItem('cloud_config_ng', JSON.stringify(this.cloudConfig()));
        });
        effect(() => {
            localStorage.setItem('use_cloud_ng', String(this.useCloud()));
        });
    }

    private async init() {
        const wsList = await this.persistence.getWorkspaces();
        this.workspaces.set(wsList);

        const savedWsId = localStorage.getItem('active_workspace_id_ng');
        const currentWs = wsList.find(w => w.id === savedWsId) || wsList[0];

        await this.vectorStore.init(currentWs.id);
        this.activeWorkspace.set(currentWs);
        this.documents.set([...this.vectorStore.getAllDocuments()]);

        const savedLocal = localStorage.getItem('local_config_ng');
        if (savedLocal) this.localConfig.set(JSON.parse(savedLocal));
        const savedCloud = localStorage.getItem('cloud_config_ng');
        if (savedCloud) this.cloudConfig.set(JSON.parse(savedCloud));

        const savedUseCloud = localStorage.getItem('use_cloud_ng');
        if (savedUseCloud) this.useCloud.set(savedUseCloud === 'true');
    }

    async createWorkspace(name: string) {
        const newWs = await this.persistence.createWorkspace(name);
        this.workspaces.update(prev => [...prev, newWs]);
        await this.switchWorkspace(newWs);
    }

    async switchWorkspace(workspace: Workspace) {
        this.isProcessing.set(true);
        try {
            await this.vectorStore.reloadWorkspace(workspace.id);
            this.activeWorkspace.set(workspace);
            this.documents.set([...this.vectorStore.getAllDocuments()]);
            localStorage.setItem('active_workspace_id_ng', workspace.id);
            this.messages.set([]);
        } finally {
            this.isProcessing.set(false);
        }
    }

    async deleteWorkspace(id: string) {
        if (this.workspaces().length <= 1) return;
        await this.persistence.deleteWorkspace(id);
        this.workspaces.update(list => list.filter(w => w.id !== id));
        if (this.activeWorkspace()?.id === id) {
            await this.switchWorkspace(this.workspaces()[0]);
        }
    }

    async addDocument(title: string, content: string, sourceId?: string) {
        try {
            const embedding = await this.apiService.getEmbedding(
                content,
                this.localConfig().baseUrl,
                this.localConfig().embeddingModel || ''
            );
            const doc: DocumentEntry = {
                id: Math.random().toString(36).substring(2, 11),
                title,
                content,
                embedding,
                sourceId: sourceId || `manual-${Date.now()}`,
                dateAdded: Date.now()
            };
            await this.vectorStore.addDocument(doc);
            this.documents.set([...this.vectorStore.getAllDocuments()]);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async addDocumentFromFile(file: File) {
        this.isProcessing.set(true);
        try {
            const content = await this.fileService.extractText(file);
            const sourceId = file.name;
            if (this.isChunkingEnabled()) {
                const chunks = this.chunkingService.splitText(content);
                for (let i = 0; i < chunks.length; i++) {
                    const chunkTitle = chunks.length > 1 ? `${file.name} (Part ${i + 1})` : file.name;
                    await this.addDocument(chunkTitle, chunks[i], sourceId);
                }
            } else {
                await this.addDocument(file.name, content, sourceId);
            }
        } finally {
            this.isProcessing.set(false);
        }
    }

    async deleteDocument(id: string, sourceId: string) {
        if (sourceId) {
            await this.vectorStore.deleteBySourceId(sourceId);
        } else {
            await this.vectorStore.deleteById(id);
        }
        this.documents.set([...this.vectorStore.getAllDocuments()]);
    }

    async askQuestion(question: string) {
        this.messages.update(prev => [...prev, { role: 'user', content: question }]);
        this.isProcessing.set(true);
        try {
            const embedding = await this.apiService.getEmbedding(
                question,
                this.localConfig().baseUrl,
                this.localConfig().embeddingModel || ''
            );
            const similarDocs = await this.vectorStore.searchSimilar(embedding, this.topK());
            const context = similarDocs.map(d => d.content);

            const config = this.useCloud() ? this.cloudConfig() : this.localConfig();

            const answer = await this.apiService.getChatCompletion({
                prompt: question,
                context,
                baseUrl: config.baseUrl,
                model: config.chatModel,
                apiKey: this.useCloud() ? this.cloudConfig().apiKey : undefined
            });
            this.messages.update(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (e) {
            this.messages.update(prev => [...prev, { role: 'assistant', content: `Error: ${e instanceof Error ? e.message : 'Unknown error'}` }]);
        } finally {
            this.isProcessing.set(false);
        }
    }

    clearChat() {
        this.messages.set([]);
    }

    updateConfig(type: 'local' | 'cloud', config: any) {
        if (type === 'local') {
            this.localConfig.set(config);
        } else {
            this.cloudConfig.set(config);
        }
    }
}
