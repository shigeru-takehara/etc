/**
 * Reusable Toggle Switch Component
 * 
 * Usage:
 * <app-toggle 
 *   [active]="isActive" 
 *   [activeBg]="'#0ea5e9'" 
 *   (toggle)="onToggle()"
 * ></app-toggle>
 * 
 * Inputs:
 * - active (required): boolean - current state of the toggle
 * - activeBg (optional): string - background color when active (default: #0ea5e9)
 * 
 * Outputs:
 * - toggle: void - emitted when the toggle is clicked
 */
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button 
      (click)="toggle.emit()"
      class="toggle-container"
      [style.background]="active() ? activeBg() : '#334155'"
    >
      <div 
        class="toggle-thumb" 
        [style.left]="active() ? '1.5rem' : '0.25rem'"
      ></div>
    </button>
  `,
    styles: [`
    :host { display: inline-block; vertical-align: middle; }
    .toggle-container { 
      width: 2.5rem; 
      height: 1.25rem; 
      border-radius: 9999px; 
      border: none; 
      cursor: pointer; 
      position: relative; 
      transition: background 0.2s; 
      display: flex;
      align-items: center;
    }
    .toggle-thumb { 
      position: absolute; 
      top: 0.25rem; 
      width: 0.75rem; 
      height: 0.75rem; 
      background: white; 
      border-radius: 9999px; 
      transition: left 0.2s; 
    }
  `]
})
export class AppToggleComponent {
    active = input.required<boolean>();
    activeBg = input<string>('#0ea5e9');
    toggle = output<void>();
}
