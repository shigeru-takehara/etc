import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-workspace-trigger',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <button 
      (click)="toggle.emit()"
      class="w-full p-3 flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl hover:border-primary-500/50 transition-all text-left group"
      style="display: flex; width: 100%; padding: 0.75rem; background: #020617; border: 1px solid #1e293b; border-radius: 0.75rem; color: white; cursor: pointer; justify-content: space-between; align-items: center;"
    >
      <div class="flex items-center gap-2 min-w-0" style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
        <lucide-icon [name]="'folder-open'" class="text-primary-400 shrink-0" [size]="18"></lucide-icon>
        <span class="text-sm font-medium text-slate-200 truncate">{{ label() }}</span>
      </div>
      <lucide-icon 
        [name]="'chevron-down'" 
        [size]="16" 
        class="text-slate-500 transition-transform" 
        [style.transform]="isOpen() ? 'rotate(180deg)' : 'rotate(0deg)'"
      ></lucide-icon>
    </button>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class WorkspaceTriggerComponent {
    label = input.required<string>();
    isOpen = input.required<boolean>();
    toggle = output();
}
