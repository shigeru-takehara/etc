import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-setting-trigger',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <button 
      (click)="clicked.emit()"
      class="btn-ghost"
    >
      <lucide-icon [name]="'settings'" [size]="18"></lucide-icon> Configure Provider
    </button>
  `,
    styles: [`
    :host { display: block; width: 100%; }
    .btn-ghost {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 0.75rem;
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-ghost:hover {
      background: rgba(30, 41, 59, 0.5);
      color: #cbd5e1;
      border-color: #334155;
    }
  `]
})
export class SettingTriggerComponent {
    clicked = output();
}
