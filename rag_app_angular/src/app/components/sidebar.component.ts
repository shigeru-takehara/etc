import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RagService } from '../services/rag.service';
import { Workspace } from '../services/persistence.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="text-xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2" style="display: flex; align-items: center;">
          <lucide-icon [name]="'cpu'" class="text-primary-500"></lucide-icon> RAG Assistant
        </h1>
        <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Angular Edition</p>
      </div>

      <div class="sidebar-content">
        <!-- Workspace Manager -->
        <div style="margin-bottom: 2rem;">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3 block" style="display: block; margin-bottom: 0.75rem;">Knowledge Workspace</label>
          <div class="relative">
            <button 
              (click)="isWsMenuOpen.set(!isWsMenuOpen())"
              class="w-full p-3 flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl hover:border-primary-500/50 transition-all text-left group"
              style="display: flex; width: 100%; padding: 0.75rem; background: #020617; border: 1px solid #1e293b; border-radius: 0.75rem; color: white; cursor: pointer; justify-content: space-between; align-items: center;"
            >
              <div class="flex items-center gap-2 min-w-0" style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                <lucide-icon [name]="'folder-open'" class="text-primary-400 shrink-0" [size]="18"></lucide-icon>
                <span class="text-sm font-medium text-slate-200 truncate">{{ activeWorkspace()?.name || 'Loading...' }}</span>
              </div>
              <lucide-icon [name]="'chevron-down'" [size]="16" class="text-slate-500 transition-transform" [ngStyle]="{'transform': isWsMenuOpen() ? 'rotate(180deg)' : 'rotate(0deg)'}"></lucide-icon>
            </button>

            <div *ngIf="isWsMenuOpen()" class="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden" style="position: absolute; top: 100%; left: 0; right: 0; background: #0f172a; border: 1px solid #1e293b; border-radius: 0.75rem; margin-top: 0.5rem; z-index: 100;">
              <div class="p-2" style="max-height: 15rem; overflow-y: auto; padding: 0.5rem;">
                @for (ws of workspaces(); track ws.id) {
                  <div class="flex items-center gap-1 group" style="display: flex; align-items: center; gap: 0.25rem;">
                    <button 
                      (click)="switchWorkspace(ws)"
                      class="flex-1 flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors"
                      [ngStyle]="{'background': activeWorkspace()?.id === ws.id ? 'rgba(14, 165, 233, 0.1)' : 'transparent', 'color': activeWorkspace()?.id === ws.id ? '#38bdf8' : '#94a3b8'}"
                      style="flex: 1; display: flex; justify-content: space-between; padding: 0.6rem; border-radius: 0.5rem; border: none; cursor: pointer;"
                    >
                      <span class="truncate">{{ ws.name }}</span>
                      <lucide-icon *ngIf="activeWorkspace()?.id === ws.id" [name]="'check'" [size]="14"></lucide-icon>
                    </button>
                    <button 
                      *ngIf="workspaces().length > 1"
                      (click)="deleteWorkspace(ws.id)"
                      style="padding: 0.5rem; border: none; background: transparent; cursor: pointer; color: #475569;"
                    >
                      <lucide-icon [name]="'trash-2'" [size]="14"></lucide-icon>
                    </button>
                  </div>
                }
              </div>
              <div style="padding: 0.5rem; border-top: 1px solid #1e293b; background: rgba(2, 6, 23, 0.5);">
                <button 
                  (click)="handleCreateWorkspace()"
                  style="width: 100%; padding: 0.5rem; background: transparent; border: none; color: #38bdf8; cursor: pointer; font-size: 0.75rem; font-weight: 500;"
                >
                  + Create New Workspace
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div>
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3 block" style="display: block; margin-bottom: 0.75rem;">Documents</label>
          <button 
            (click)="fileInput.click()"
            class="btn-primary"
            style="width: 100%;"
          >
            <lucide-icon [name]="'plus'" [size]="18"></lucide-icon>
            <span>Update Knowledge</span>
          </button>
          <input #fileInput type="file" (change)="handleFileChange($event)" class="hidden" accept=".pdf,.docx,.md,.txt" style="display: none;" />
          
          <div style="margin-top: 1.5rem;">
            @for (doc of uniqueDocs(); track doc.sourceId) {
              <div class="group flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-default" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.75rem;">
                <lucide-icon [name]="'file-text'" class="text-slate-500 shrink-0" [size]="18"></lucide-icon>
                <div style="flex: 1; min-width: 0;">
                  <p class="text-sm font-medium text-slate-300 truncate">{{ doc.title }}</p>
                  <p class="text-[10px] text-slate-500 font-medium">
                    {{ getChunkCount(doc.sourceId) }} chunks
                  </p>
                </div>
                <button 
                  (click)="ragService.deleteDocument(doc.id, doc.sourceId)"
                  style="padding: 0.4rem; background: transparent; border: none; color: #475569; cursor: pointer;"
                >
                  <lucide-icon [name]="'trash-2'" [size]="16"></lucide-icon>
                </button>
              </div>
            }
            @if (documents().length === 0) {
              <p style="text-align: center; padding: 2rem 0; color: #475569; font-size: 0.75rem; font-style: italic;">No documents found</p>
            }
          </div>
        </div>

        <!-- Configuration -->
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(30, 41, 59, 0.5);">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 block" style="display: block; margin-bottom: 1rem;">Configuration</label>
          
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem 1rem;">
            <span style="font-size: 0.875rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem;">
              <lucide-icon [name]="'layers'" style="color: #64748b;" [size]="16"></lucide-icon> Chunking
            </span>
            <button 
              (click)="ragService.isChunkingEnabled.set(!isChunkingEnabled())"
              style="width: 2.5rem; height: 1.25rem; border-radius: 9999px; border: none; cursor: pointer; position: relative; transition: background 0.2s;"
              [ngStyle]="{'background': isChunkingEnabled() ? '#0284c7' : '#334155'}"
            >
              <div style="position: absolute; top: 0.25rem; width: 0.75rem; height: 0.75rem; background: white; border-radius: 9999px; transition: left 0.2s;" [ngStyle]="{'left': isChunkingEnabled() ? '1.5rem' : '0.25rem'}"></div>
            </button>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem 1rem;">
            <span style="font-size: 0.875rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem;">
              <lucide-icon [name]="'sparkles'" style="color: #64748b;" [size]="16"></lucide-icon> Smart Search
            </span>
            <button 
              (click)="ragService.isQueryRewritingEnabled.set(!isQueryRewritingEnabled())"
              style="width: 2.5rem; height: 1.25rem; border-radius: 9999px; border: none; cursor: pointer; position: relative; transition: background 0.2s;"
              [ngStyle]="{'background': isQueryRewritingEnabled() ? '#0284c7' : '#334155'}"
            >
              <div style="position: absolute; top: 0.25rem; width: 0.75rem; height: 0.75rem; background: white; border-radius: 9999px; transition: left 0.2s;" [ngStyle]="{'left': isQueryRewritingEnabled() ? '1.5rem' : '0.25rem'}"></div>
            </button>
          </div>

          <div style="padding: 0 0.5rem 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.5rem;">
              <span style="display: flex; align-items: center; gap: 0.5rem;">
                <lucide-icon [name]="'search'" style="color: #64748b;" [size]="16"></lucide-icon> Top-K
              </span>
              <span style="color: #38bdf8; font-family: monospace; font-size: 0.75rem;">{{ topK() }}</span>
            </div>
            <input 
              type="range" min="1" max="50" [value]="topK()" 
              (input)="handleTopKChange($event)"
              style="width: 100%; height: 0.25rem; background: #334155; border-radius: 0.5rem; cursor: pointer; accent-color: #0ea5e9;"
            />
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem;">
            <span style="font-size: 0.875rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem;">
              <lucide-icon [name]="'cpu'" style="color: #64748b;" [size]="16"></lucide-icon> {{ useCloud() ? 'Cloud mode' : 'Local mode' }}
            </span>
            <button 
              (click)="ragService.useCloud.set(!useCloud())"
              style="width: 2.5rem; height: 1.25rem; border-radius: 9999px; border: none; cursor: pointer; position: relative; transition: background 0.2s;"
              [ngStyle]="{'background': useCloud() ? '#0284c7' : '#334155'}"
            >
              <div style="position: absolute; top: 0.25rem; width: 0.75rem; height: 0.75rem; background: white; border-radius: 9999px; transition: left 0.2s;" [ngStyle]="{'left': useCloud() ? '1.5rem' : '0.25rem'}"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <button 
          (click)="openSettings.emit()"
          class="btn-ghost"
        >
          <lucide-icon [name]="'settings'" [size]="18"></lucide-icon> Configure Provider
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
  public ragService = inject(RagService);
  openSettings = output();
  isWsMenuOpen = signal(false);

  documents = this.ragService.documents;
  workspaces = this.ragService.workspaces;
  activeWorkspace = this.ragService.activeWorkspace;
  isChunkingEnabled = this.ragService.isChunkingEnabled;
  isQueryRewritingEnabled = this.ragService.isQueryRewritingEnabled;
  topK = this.ragService.topK;
  useCloud = this.ragService.useCloud;

  // Computed grouping
  uniqueDocs = () => {
    return Object.values(this.documents().reduce((acc, doc) => {
      if (!acc[doc.sourceId]) acc[doc.sourceId] = doc;
      return acc;
    }, {} as Record<string, any>));
  };

  getChunkCount(sourceId: string) {
    return this.documents().filter(d => d.sourceId === sourceId).length;
  }

  async handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      try {
        await this.ragService.addDocumentFromFile(file);
      } catch (err) {
        alert('Document ingestion failed. Please check your Local LLM connection.');
        console.error(err);
      }
      input.value = '';
    }
  }

  handleCreateWorkspace() {
    const name = prompt('Enter workspace name:');
    if (name) this.ragService.createWorkspace(name);
  }

  switchWorkspace(ws: Workspace) {
    this.ragService.switchWorkspace(ws);
    this.isWsMenuOpen.set(false);
  }

  deleteWorkspace(id: string) {
    this.ragService.deleteWorkspace(id);
  }

  handleTopKChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.ragService.topK.set(parseInt(val));
  }
}
