/**
 * Base Toggle Component with Label and Icon
 * 
 * Usage:
 * <app-toggle-base
 *   label="Enable Feature"
 *   iconName="shield"
 *   [isActive]="featureEnabled"
 *   (toggle)="featureEnabled = !featureEnabled"
 * ></app-toggle-base>
 * 
 * Inputs:
 * - label (required): string - text label next to toggle
 * - iconName (required): string - lucide icon name
 * - iconColor (optional): string - color of the icon (default: #64748b)
 * - tooltip (optional): string - help text for the row
 * - isActive (required): boolean - current state
 * - activeBg (optional): string - background color when active (default: #0ea5e9)
 * 
 * Outputs:
 * - toggle: void - emitted when the toggle is clicked
 */
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AppToggleComponent } from './app-toggle.component';
import { LabeledIconComponent } from './labeled-icon.component';

@Component({
  selector: 'app-toggle-base',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppToggleComponent, LabeledIconComponent],
  template: `
    <div 
      class="toggle-row" 
      [title]="tooltip()"
    >
      <app-labeled-icon
        [iconName]="iconName()"
        [label]="label()"
      ></app-labeled-icon>
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
