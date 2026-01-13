import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workspace } from '../../../services/persistence.service';
import { WorkspaceTriggerComponent } from './workspace-trigger.component';
import { WorkspaceMenuComponent } from './workspace-menu.component';

@Component({
    selector: 'app-workspace-selector',
    standalone: true,
    imports: [CommonModule, WorkspaceTriggerComponent, WorkspaceMenuComponent],
    template: `
    <div style="margin-bottom: 2rem;">
      <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3 block" 
             style="display: block; margin-bottom: 0.75rem;">Knowledge Workspace</label>
      <div class="relative">
        <app-workspace-trigger 
          [label]="active()?.name || 'Loading...'" 
          [isOpen]="isOpen()" 
          (toggle)="isOpen.set(!isOpen())"
        ></app-workspace-trigger>
 
        <app-workspace-menu 
          *ngIf="isOpen()" 
          [workspaces]="list()" 
          [activeId]="active()?.id" 
          (select)="onSelect($event)" 
          (delete)="delete.emit($event)" 
          (create)="onCreate()"
        ></app-workspace-menu>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class WorkspaceSelectorComponent {
    list = input.required<Workspace[]>();
    active = input.required<Workspace | null>();

    select = output<Workspace>();
    delete = output<string>();
    create = output();

    isOpen = signal(false);

    onSelect(ws: Workspace) {
        this.select.emit(ws);
        this.isOpen.set(false);
    }

    onCreate() {
        this.create.emit();
        this.isOpen.set(false);
    }
}
