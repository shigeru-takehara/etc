import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TrashIconButtonComponent } from './trash-icon-button.component';

@Component({
  selector: 'app-document-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TrashIconButtonComponent],
  template: `
    <div class="group flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-default" 
         style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.75rem;">
      <lucide-icon [name]="'file-text'" class="text-slate-500 shrink-0" [size]="18"></lucide-icon>
      <div style="flex: 1; min-width: 0;">
        <p class="text-sm font-medium text-slate-300 truncate">{{ doc().title }}</p>
        <p class="text-[10px] text-slate-500 font-medium">
          {{ chunks() }} chunks
        </p>
      </div>
      <app-trash-icon-button (click)="delete.emit()"></app-trash-icon-button>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class DocumentItemComponent {
  doc = input.required<any>();
  chunks = input.required<number>();
  delete = output();
}
