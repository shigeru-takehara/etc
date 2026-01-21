/**
 * Reusable Icon Button Component
 * 
 * Usage:
 * <app-icon-button-base 
 *   [iconName]="'trash-2'" 
 *   [size]="16"
 *   [tooltip]="'Delete Item'"
 *   (btnClick)="onDelete($event)"
 * ></app-icon-button-base>
 * 
 * Inputs:
 * - iconName (required): string - lucide icon name
 * - size (optional): number - icon size in pixels (default: 16)
 * - tooltip (optional): string - button title/tooltip
 * 
 * Outputs:
 * - btnClick: MouseEvent - emitted when the button is clicked
 */
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-icon-button-base',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <button 
      class="icon-button"
      (click)="btnClick.emit($event)"
      [title]="tooltip()"
    >
      <lucide-icon [name]="iconName()" [size]="size()"></lucide-icon>
    </button>
  `,
    styles: [`
    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    
    .icon-button:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }
  `]
})
export class IconButtonBaseComponent {
    iconName = input.required<string>();
    size = input<number>(16);
    tooltip = input<string>('');
    btnClick = output<MouseEvent>();
}
