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
    temperature?: number;
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
    processingStatus = signal<string | null>(null);
    isChunkingEnabled = signal(true);
    isQueryRewritingEnabled = signal(false);
    topK = signal(localStorage.getItem('top_k_ng') ? parseInt(localStorage.getItem('top_k_ng')!, 10) : 5);
    similarityThreshold = signal(localStorage.getItem('similarity_threshold_ng') ? parseFloat(localStorage.getItem('similarity_threshold_ng')!) : 0.75);

    useCloud = signal(localStorage.getItem('use_cloud_ng') === 'true');
    corefUrl = signal('http://localhost:8000/resolve'); // Default URL

    localConfig = signal<RagConfig>(
        localStorage.getItem('local_config_ng') ? JSON.parse(localStorage.getItem('local_config_ng')!) : {
            baseUrl: 'http://127.0.0.1:1234/v1',
            chatModel: 'llama-3.2-3b-instruct',
            embeddingModel: 'text-embedding-nomic-embed-text-v1.5@q4_k_m',
            temperature: 1
        }
    );

    cloudConfig = signal<RagConfig>(
        localStorage.getItem('cloud_config_ng') ? JSON.parse(localStorage.getItem('cloud_config_ng')!) : {
            baseUrl: 'https://api.openai.com/v1',
            chatModel: 'gpt-4o-mini',
            apiKey: '',
            temperature: 1
        }
    );

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
            localStorage.setItem('top_k_ng', String(this.topK()));
        });
        effect(() => {
            localStorage.setItem('similarity_threshold_ng', String(this.similarityThreshold()));
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

        // Auto-fix baseUrl if it's missing /v1 for localhost/local addresses
        const currentLocal = this.localConfig();
        if (currentLocal.baseUrl &&
            (currentLocal.baseUrl.includes('localhost') || currentLocal.baseUrl.includes('127.0.0.1')) &&
            !currentLocal.baseUrl.endsWith('/v1') &&
            !currentLocal.baseUrl.endsWith('/v1/')) {
            console.log('Patching local baseUrl to include /v1');
            const newBase = currentLocal.baseUrl.replace(/\/+$/, '') + '/v1';
            this.localConfig.set({ ...currentLocal, baseUrl: newBase });
        }

        // Load backend config
        try {
            const response = await fetch('assets/backend-config.json');
            if (response.ok) {
                const config = await response.json();
                if (config.corefUrl) {
                    this.corefUrl.set(config.corefUrl);
                    console.log('Loaded backend config:', config);
                }
            }
        } catch (e) {
            console.warn('Could not load backend config, using default:', this.corefUrl());
        }
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
        this.processingStatus.set(`Extracting content from ${file.name}...`);
        try {
            let content = await this.fileService.extractText(file);

            // Co-reference Resolution
            try {
                this.processingStatus.set(`Resolving co-references for ${file.name}...`);
                console.log('Resolving co-references...');
                const response = await fetch(this.corefUrl(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: content })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.resolved_text) {
                        content = data.resolved_text;
                        console.log('Co-reference resolution complete.');
                    }
                } else {
                    console.warn('Co-reference API failed:', response.status);
                }
            } catch (e) {
                console.warn('Co-reference resolution error:', e);
            }

            const sourceId = file.name;
            if (this.isChunkingEnabled()) {
                const chunks = this.chunkingService.splitText(content);
                this.processingStatus.set(`Generated ${chunks.length} chunks. Starting ingestion...`);
                for (let i = 0; i < chunks.length; i++) {
                    this.processingStatus.set(`Ingesting chunk ${i + 1} of ${chunks.length}...`);
                    const chunkTitle = chunks.length > 1 ? `${file.name} (Part ${i + 1})` : file.name;
                    await this.addDocument(chunkTitle, chunks[i], sourceId);
                }
            } else {
                this.processingStatus.set(`Ingesting file ${file.name}...`);
                await this.addDocument(file.name, content, sourceId);
            }
        } finally {
            this.isProcessing.set(false);
            this.processingStatus.set(null);
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
        this.processingStatus.set('Preparing query...');

        try {
            let processedQuestion = question;

            // 1. Co-reference Resolution for the query (helps follow-up questions)
            try {
                this.processingStatus.set('Resolving co-references in query...');
                const corefResponse = await fetch(this.corefUrl(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: question })
                });
                if (corefResponse.ok) {
                    const data = await corefResponse.json();
                    if (data.resolved_text && data.resolved_text !== question) {
                        processedQuestion = data.resolved_text;
                        console.log('Query co-reference resolution complete:', processedQuestion);
                    }
                }
            } catch (e) {
                console.warn('Query co-reference failed, using original:', e);
            }

            this.processingStatus.set('Searching knowledge base...');
            const embedding = await this.apiService.getEmbedding(
                processedQuestion,
                this.localConfig().baseUrl,
                this.localConfig().embeddingModel || ''
            );
            const similarDocs = await this.vectorStore.searchSimilar(embedding, this.topK(), this.similarityThreshold());

            if (similarDocs.length === 0) {
                this.messages.update(prev => [...prev, {
                    role: 'assistant',
                    content: `I couldn't find any relevant information in your documents with a high enough confidence (${(this.similarityThreshold() * 100).toFixed(0)}%+). Could you please try rephrasing your question or adding more context?`
                }]);
                return;
            }

            const context = similarDocs.map(d => d.content);
            const config = this.useCloud() ? this.cloudConfig() : this.localConfig();

            this.processingStatus.set('Synthesizing answer...');
            const answer = await this.apiService.getChatCompletion({
                prompt: `${processedQuestion}\n\nPlease respond in Markdown format.`,
                context,
                baseUrl: config.baseUrl,
                model: config.chatModel,
                apiKey: this.useCloud() ? this.cloudConfig().apiKey : undefined,
                temperature: config.temperature
            });
            this.messages.update(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (e) {
            this.messages.update(prev => [...prev, { role: 'assistant', content: `Error: ${e instanceof Error ? e.message : 'Unknown error'}` }]);
        } finally {
            this.isProcessing.set(false);
            this.processingStatus.set(null);
        }
    }

    async rewriteQuery(originalQuery: string): Promise<string> {
        const config = this.useCloud() ? this.cloudConfig() : this.localConfig();
        const prompt = `Refine the following user query to be more suitable for a semantic vector search. 
        It should be concise and keyword-focused if necessary, but maintain the original intent. 
        Return ONLY the refined query text, no other commentary.
        
        Original Query: "${originalQuery}"`;

        try {
            const rewritten = await this.apiService.getChatCompletion({
                prompt,
                context: [], // No context needed for rewriting itself
                baseUrl: config.baseUrl,
                model: config.chatModel,
                apiKey: this.useCloud() ? this.cloudConfig().apiKey : undefined,
                temperature: config.temperature
            });
            return rewritten.trim().replace(/^"|"$/g, ''); // Remove quotes if any
        } catch (e) {
            console.warn('Query rewriting failed, using original:', e);
            return originalQuery;
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
