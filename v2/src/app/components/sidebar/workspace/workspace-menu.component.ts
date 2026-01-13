import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Workspace } from '../../../services/persistence.service';

@Component({
    selector: 'app-workspace-menu',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden" 
         style="position: absolute; top: 100%; left: 0; right: 0; background: #0f172a; border: 1px solid #1e293b; border-radius: 0.75rem; margin-top: 0.5rem; z-index: 100;">
      <div class="p-2" style="max-height: 15rem; overflow-y: auto; padding: 0.5rem;">
        @for (ws of workspaces(); track ws.id) {
          <div class="flex items-center gap-1 group" style="display: flex; align-items: center; gap: 0.25rem;">
            <button 
              (click)="select.emit(ws)"
              class="flex-1 flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors"
              [style.background]="activeId() === ws.id ? 'rgba(14, 165, 233, 0.1)' : 'transparent'"
              [style.color]="activeId() === ws.id ? '#38bdf8' : '#94a3b8'"
              style="flex: 1; display: flex; justify-content: space-between; padding: 0.6rem; border-radius: 0.5rem; border: none; cursor: pointer;"
            >
              <span class="truncate">{{ ws.name }}</span>
              <lucide-icon *ngIf="activeId() === ws.id" [name]="'check'" [size]="14"></lucide-icon>
            </button>
            <button 
              *ngIf="workspaces().length > 1"
              (click)="delete.emit(ws.id)"
              style="padding: 0.5rem; border: none; background: transparent; cursor: pointer; color: #475569;"
            >
              <lucide-icon [name]="'trash-2'" [size]="14"></lucide-icon>
            </button>
          </div>
        }
      </div>
      <div style="padding: 0.5rem; border-top: 1px solid #1e293b; background: rgba(2, 6, 23, 0.5);">
        <button 
          (click)="create.emit()"
          style="width: 100%; padding: 0.5rem; background: transparent; border: none; color: #38bdf8; cursor: pointer; font-size: 0.75rem; font-weight: 500;"
        >
          + Create New Workspace
        </button>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class WorkspaceMenuComponent {
    workspaces = input.required<Workspace[]>();
    activeId = input<string>();
    select = output<Workspace>();
    delete = output<string>();
    create = output();
}
