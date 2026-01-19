import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AppToggleComponent } from './app-toggle.component';

@Component({
  selector: 'app-toggle-base',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppToggleComponent],
  template: `
    <div 
      class="toggle-row" 
      [title]="tooltip()"
    >
      <span class="label-text">
        <lucide-icon [name]="iconName()" [style.color]="iconColor()" [size]="16"></lucide-icon>
        {{ label() }}
      </span>
      <app-toggle
        [active]="isActive()"
        [activeBg]="activeBg()"
        (toggle)="toggle.emit()"
      ></app-toggle>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 0 0.5rem 1rem; }
    .label-text { font-size: 0.875rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
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
