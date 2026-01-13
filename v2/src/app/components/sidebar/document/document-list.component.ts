import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DocumentItemComponent } from './document-item.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-document-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, DocumentItemComponent],
    template: `
    <div>
      <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3 block" 
             style="display: block; margin-bottom: 0.75rem;">Documents</label>
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
          <app-document-item 
            [doc]="doc" 
            [chunks]="getChunkCount(doc.sourceId)"
            (delete)="deleteDocument.emit({id: doc.id, sourceId: doc.sourceId})"
          ></app-document-item>
        }
        @if (documents().length === 0) {
          <p style="text-align: center; padding: 2rem 0; color: #475569; font-size: 0.75rem; font-style: italic;">No documents found</p>
        }
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
    .btn-primary {
      @apply flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm;
      background-color: var(--primary-600, #2563eb);
    }
  `]
})
export class DocumentListComponent {
    documents = input.required<any[]>();
    deleteDocument = output<{ id: string, sourceId: string }>();
    fileUpload = output<File>();

    uniqueDocs = (): any[] => {
        const docs = this.documents();
        return Object.values(docs.reduce((acc: any, doc: any) => {
            if (!acc[doc.sourceId]) acc[doc.sourceId] = doc;
            return acc;
        }, {} as Record<string, any>));
    };

    getChunkCount(sourceId: string): number {
        return this.documents().filter((d: any) => d.sourceId === sourceId).length;
    }

    handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.fileUpload.emit(file);
            input.value = '';
        }
    }
}
