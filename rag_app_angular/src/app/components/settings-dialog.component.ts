import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RagService } from '../services/rag.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen()" class="modal-overlay">
      <div class="modal-content animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="sidebar-header" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="flex items-center gap-2" style="display: flex; align-items: center; gap: 0.5rem;">
            <lucide-icon [name]="'settings'" class="text-primary-400" [size]="20"></lucide-icon>
            <h2 class="text-xl font-semibold">Settings</h2>
          </div>
          <button (click)="close.emit()" style="padding: 0.5rem; border-radius: 9999px; background: transparent; border: none; color: #94a3b8; cursor: pointer;">
            <lucide-icon [name]="'x'" [size]="20"></lucide-icon>
          </button>
        </div>

        <!-- Tabs -->
        <div style="display: flex; border-bottom: 1px solid var(--border-slate);">
          <button 
            (click)="activeTab.set('local')"
            style="flex: 1; padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: transparent; border: none; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;"
            [ngStyle]="{'color': activeTab() === 'local' ? '#38bdf8' : '#94a3b8', 'border-bottom-color': activeTab() === 'local' ? '#38bdf8' : 'transparent', 'background': activeTab() === 'local' ? 'rgba(56, 189, 248, 0.05)' : 'transparent'}"
          >
            <lucide-icon [name]="'database'" [size]="18"></lucide-icon> Local
          </button>
          <button 
            (click)="activeTab.set('cloud')"
            style="flex: 1; padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: transparent; border: none; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;"
            [ngStyle]="{'color': activeTab() === 'cloud' ? '#38bdf8' : '#94a3b8', 'border-bottom-color': activeTab() === 'cloud' ? '#38bdf8' : 'transparent', 'background': activeTab() === 'cloud' ? 'rgba(56, 189, 248, 0.05)' : 'transparent'}"
          >
            <lucide-icon [name]="'cloud'" [size]="18"></lucide-icon> Cloud
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4" style="padding: 1.5rem;">
          <div *ngIf="activeTab() === 'local'" class="space-y-4">
            <div style="padding: 0.75rem; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 0.5rem; margin-bottom: 1rem;">
                <p class="text-xs text-primary-300 font-medium" style="font-size: 0.75rem; color: #7dd3fc; margin: 0;">
                  Internal Knowledge Base: Active indexing and search.
                </p>
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="block text-sm font-medium text-slate-400 mb-1" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.25rem;">Local LLM Base URL</label>
              <input type="text" [(ngModel)]="tempLocal.baseUrl" style="width: 100%; background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.625rem; color: white; outline: none;" />
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="block text-sm font-medium text-slate-400 mb-1" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.25rem;">Chat Model</label>
              <input type="text" [(ngModel)]="tempLocal.chatModel" style="width: 100%; background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.625rem; color: white; outline: none;" />
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="block text-sm font-medium text-slate-400 mb-1" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.25rem;">Embedding Model</label>
              <input type="text" [(ngModel)]="tempLocal.embeddingModel" style="width: 100%; background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.625rem; color: white; outline: none;" />
            </div>
            <button 
              (click)="testConnection('local')" 
              class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              [disabled]="testingLocal()"
              style="width: 100%; padding: 0.5rem; background: #1e293b; border: none; border-radius: 0.5rem; color: #cbd5e1; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem;"
            >
              <lucide-icon *ngIf="!testingLocal()" [name]="localStatus() === 'success' ? 'check' : (localStatus() === 'error' ? 'alert-circle' : 'activity')" [size]="16" [class]="localStatus() === 'success' ? 'text-green-400' : (localStatus() === 'error' ? 'text-red-400' : 'text-slate-400')"></lucide-icon>
              {{ testingLocal() ? 'Testing...' : (localStatus() === 'success' ? 'Connection Verified' : (localStatus() === 'error' ? 'Connection Failed' : 'Test Local Connection')) }}
            </button>
          </div>

          <div *ngIf="activeTab() === 'cloud'" class="space-y-4">
            <div style="margin-bottom: 1rem;">
              <label class="block text-sm font-medium text-slate-400 mb-1" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.25rem;">Cloud API Base URL</label>
              <input type="text" [(ngModel)]="tempCloud.baseUrl" style="width: 100%; background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.625rem; color: white; outline: none;" />
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="block text-sm font-medium text-slate-400 mb-1" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.25rem;">Cloud Model</label>
              <input type="text" [(ngModel)]="tempCloud.chatModel" style="width: 100%; background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.625rem; color: white; outline: none;" />
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="block text-sm font-medium text-slate-400 mb-1" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.25rem;">API Key</label>
              <input type="password" [(ngModel)]="tempCloud.apiKey" style="width: 100%; background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.625rem; color: white; outline: none;" />
            </div>
            <button 
              (click)="testConnection('cloud')" 
              class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              [disabled]="testingCloud()"
              style="width: 100%; padding: 0.5rem; background: #1e293b; border: none; border-radius: 0.5rem; color: #cbd5e1; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem;"
            >
              <lucide-icon *ngIf="!testingCloud()" [name]="cloudStatus() === 'success' ? 'check' : (cloudStatus() === 'error' ? 'alert-circle' : 'activity')" [size]="16" [class]="cloudStatus() === 'success' ? 'text-green-400' : (cloudStatus() === 'error' ? 'text-red-400' : 'text-slate-400')"></lucide-icon>
              {{ testingCloud() ? 'Testing...' : (cloudStatus() === 'success' ? 'Connection Verified' : (cloudStatus() === 'error' ? 'Connection Failed' : 'Test Cloud Connection')) }}
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="sidebar-footer" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button (click)="close.emit()" class="btn-ghost" style="width: auto;">Cancel</button>
          <button (click)="handleSave()" class="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  `
})
export class SettingsDialogComponent {
  private ragService = inject(RagService);

  isOpen = input.required<boolean>();
  close = output();

  activeTab = signal<'local' | 'cloud'>('local');

  tempLocal = { ...this.ragService.localConfig() };
  tempCloud = { ...this.ragService.cloudConfig() };

  testingLocal = signal(false);
  testingCloud = signal(false);
  localStatus = signal<'idle' | 'success' | 'error'>('idle');
  cloudStatus = signal<'idle' | 'success' | 'error'>('idle');

  private apiService = inject(ApiService);
  // Need to import ApiService in imports or via RagService access, but RagService's apiService is private.
  // So I need to inject ApiService directly here.

  async testConnection(type: 'local' | 'cloud') {
    if (type === 'local') {
      this.testingLocal.set(true);
      this.localStatus.set('idle');
      const success = await this.apiService.testConnection(this.tempLocal.baseUrl);
      this.localStatus.set(success ? 'success' : 'error');
      this.testingLocal.set(false);
    } else {
      this.testingCloud.set(true);
      this.cloudStatus.set('idle');
      const success = await this.apiService.testConnection(this.tempCloud.baseUrl, this.tempCloud.apiKey);
      this.cloudStatus.set(success ? 'success' : 'error');
      this.testingCloud.set(false);
    }
  }

  handleSave() {
    this.ragService.updateConfig('local', this.tempLocal);
    this.ragService.updateConfig('cloud', this.tempCloud);
    this.close.emit();
  }
}
