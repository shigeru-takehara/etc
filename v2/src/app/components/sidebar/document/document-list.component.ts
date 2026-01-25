import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabeledIconComponent } from '../../base/labeled-icon.component';
import { DocumentItemComponent } from './document-item.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, LabeledIconComponent, DocumentItemComponent],
  template: `
    <div>
      <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3 block" 
             style="display: block; margin-bottom: 0.75rem;">Documents</label>
      
      <app-labeled-icon
        [iconName]="'plus'"
        [label]="'Update Knowledge'"
        [tooltip]="'Supported formats: PDF, DOCX, Markdown, Text'"
        [variant]="'primary'"
        [fullWidth]="true"
        [clickable]="true"
        (btnClick)="fileInput.click()"
      ></app-labeled-icon>
      
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
