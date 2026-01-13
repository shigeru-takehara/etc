import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-toggle-base',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div 
      class="toggle-row" 
      [title]="tooltip()"
    >
      <span class="label-text">
        <lucide-icon [name]="iconName()" [style.color]="iconColor()" [size]="16"></lucide-icon>
        {{ label() }}
      </span>
      <button 
        (click)="toggle.emit()"
        class="toggle-container"
        [style.background]="isActive() ? activeBg() : '#334155'"
      >
        <div 
          class="toggle-thumb" 
          [style.left]="isActive() ? '1.5rem' : '0.25rem'"
        ></div>
      </button>
    </div>
  `,
    styles: [`
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem 1rem; }
    .label-text { font-size: 0.875rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
    .toggle-container { width: 2.5rem; height: 1.25rem; border-radius: 9999px; border: none; cursor: pointer; position: relative; transition: background 0.2s; }
    .toggle-thumb { position: absolute; top: 0.25rem; width: 0.75rem; height: 0.75rem; background: white; border-radius: 9999px; transition: left 0.2s; }
  `]
})
export class ToggleBaseComponent {
    label = input.required<string>();
    iconName = input.required<string>();
    iconColor = input<string>('#64748b');
    tooltip = input<string>('');
    isActive = input.required<boolean>();
    activeBg = input<string>('#0ea5e9');
    toggle = output<void>();
}
