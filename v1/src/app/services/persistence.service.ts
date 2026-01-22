import { Injectable } from '@angular/core';
import { openDB, type IDBPDatabase } from 'idb';

const GLOBAL_DB_NAME = 'rag_global_config_ng';
const WORKSPACES_STORE = 'workspaces';

const STORE_NAME = 'documents';
const INDEX_STORE = 'index_data';

export interface Workspace {
    id: string;
    name: string;
    dateCreated: number;
}

@Injectable({
    providedIn: 'root'
})
export class PersistenceService {
    private db: IDBPDatabase | null = null;
    private currentDbName: string = 'rag_workspace_default';

    async getWorkspaces(): Promise<Workspace[]> {
        const globalDb = await openDB(GLOBAL_DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(WORKSPACES_STORE)) {
                    db.createObjectStore(WORKSPACES_STORE, { keyPath: 'id' });
                }
            },
        });
        const workspaces = await globalDb.getAll(WORKSPACES_STORE);
        if (workspaces.length === 0) {
            const defaultWS = { id: 'default', name: 'Default Store', dateCreated: Date.now() };
            await globalDb.put(WORKSPACES_STORE, defaultWS);
            return [defaultWS];
        }
        return workspaces;
    }

    async createWorkspace(name: string): Promise<Workspace> {
        const globalDb = await openDB(GLOBAL_DB_NAME, 1);
        const newWS = {
            id: Math.random().toString(36).substring(2, 11),
            name,
            dateCreated: Date.now()
        };
        await globalDb.put(WORKSPACES_STORE, newWS);
        return newWS;
    }

    async deleteWorkspace(id: string) {
        const globalDb = await openDB(GLOBAL_DB_NAME, 1);
        await globalDb.delete(WORKSPACES_STORE, id);
    }

    async init(workspaceId: string = 'default') {
        if (this.db) {
            this.db.close();
            this.db = null;
        }

        this.currentDbName = `rag_workspace_${workspaceId}_ng`;
        this.db = await openDB(this.currentDbName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(INDEX_STORE)) {
                    db.createObjectStore(INDEX_STORE);
                }
            },
        });
    }

    async saveDocuments(docs: any[]) {
        if (!this.db) await this.init();
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.clear();
        for (const doc of docs) {
            await store.put(doc);
        }
        await tx.done;
    }

    async getAllDocuments(): Promise<any[]> {
        if (!this.db) await this.init();
        return await this.db!.getAll(STORE_NAME);
    }

    async clearAll() {
        if (!this.db) await this.init();
        const tx = this.db!.transaction([STORE_NAME, INDEX_STORE], 'readwrite');
        await tx.objectStore(STORE_NAME).clear();
        await tx.objectStore(INDEX_STORE).clear();
        await tx.done;
    }
}
