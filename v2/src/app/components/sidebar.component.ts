import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RagService } from '../services/rag.service';
import { Workspace } from '../services/persistence.service';
import { SidebarHeaderComponent } from './sidebar/sidebar-header.component';
import { WorkspaceSelectorComponent } from './sidebar/workspace/workspace-selector.component';

import { DocumentListComponent } from './sidebar/document/document-list.component';
import { EnableKnowledgeToggleComponent } from './sidebar/toggle/enable-knowledge-toggle.component';
import { SmartSplitToggleComponent } from './sidebar/toggle/smart-split-toggle.component';
import { SmartSearchToggleComponent } from './sidebar/toggle/smart-search-toggle.component';
import { ResultCountSliderComponent } from './sidebar/slider/result-count-slider.component';
import { SearchPrecisionSliderComponent } from './sidebar/slider/search-precision-slider.component';
import { CloudModeToggleComponent } from './sidebar/toggle/cloud-mode-toggle.component';
import { SettingTriggerComponent } from './sidebar/setting/setting-trigger.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    SidebarHeaderComponent,
    WorkspaceSelectorComponent,
    DocumentListComponent,
    EnableKnowledgeToggleComponent,
    SmartSplitToggleComponent,
    SmartSearchToggleComponent,
    ResultCountSliderComponent,
    SearchPrecisionSliderComponent,
    CloudModeToggleComponent,
    SettingTriggerComponent
  ],
  template: `
    <div class="sidebar">
      <app-sidebar-header></app-sidebar-header>

      <div class="sidebar-content">
        <!-- Workspace Manager -->
        <app-workspace-selector
          [list]="workspaces()"
          [active]="activeWorkspace()"
          (select)="switchWorkspace($event)"
          (delete)="deleteWorkspace($event)"
          (create)="handleCreateWorkspace()"
        ></app-workspace-selector>

        <!-- Documents -->
        <app-document-list
          [documents]="documents()"
          (deleteDocument)="ragService.deleteDocument($event.id, $event.sourceId)"
          (fileUpload)="onDocumentUpload($event)"
        ></app-document-list>

        <!-- Configuration -->
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(30, 41, 59, 0.5);">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 block" style="display: block; margin-bottom: 1rem;">Configuration</label>
          
          <app-enable-knowledge-toggle></app-enable-knowledge-toggle>
          <app-smart-split-toggle></app-smart-split-toggle>
          <app-smart-search-toggle></app-smart-search-toggle>

          <app-result-count-slider></app-result-count-slider>
          <app-search-precision-slider></app-search-precision-slider>
          <app-cloud-mode-toggle></app-cloud-mode-toggle>
        </div>
      </div>

      <div class="sidebar-footer">
        <app-setting-trigger (clicked)="openSettings.emit()"></app-setting-trigger>
      </div>
    </div>
  `
})
export class SidebarComponent {
  public ragService = inject(RagService);
  openSettings = output();

  documents = this.ragService.documents;
  workspaces = this.ragService.workspaces;
  activeWorkspace = this.ragService.activeWorkspace;
  isChunkingEnabled = this.ragService.isChunkingEnabled;
  isQueryRewritingEnabled = this.ragService.isQueryRewritingEnabled;
  isRagEnabled = this.ragService.isRagEnabled;
  topK = this.ragService.topK;
  similarityThreshold = this.ragService.similarityThreshold;
  useCloud = this.ragService.useCloud;

  // Computed grouping no longer needed here as it's in DocumentListComponent

  async onDocumentUpload(file: File) {
    try {
      await this.ragService.addDocumentFromFile(file);
    } catch (err) {
      alert('Document ingestion failed. Please check your Local LLM connection.');
      console.error(err);
    }
  }

  handleCreateWorkspace() {
    const name = prompt('Enter workspace name:');
    if (name) this.ragService.createWorkspace(name);
  }

  switchWorkspace(ws: Workspace) {
    this.ragService.switchWorkspace(ws);
  }

  deleteWorkspace(id: string) {
    this.ragService.deleteWorkspace(id);
  }
}
