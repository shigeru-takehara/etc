import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Reusable Button Component with Icon and Label
 * 
 * Usage:
 * <app-button-base 
 *   [iconName]="'settings'" 
 *   [label]="'Configure Provider'"
 *   [variant]="'ghost'"
 *   [fullWidth]="true"
 *   (btnClick)="onConfig()"
 * ></app-button-base>
 */
@Component({
    selector: 'app-button-base',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <button 
      [class]="'btn-' + variant()"
      [class.full-width]="fullWidth()"
      (click)="btnClick.emit($event)"
      [title]="tooltip()"
    >
      <div class="content">
        @if (iconName()) {
          <lucide-icon [name]="iconName()!" [size]="iconSize()"></lucide-icon>
        }
        <span class="label">{{ label() }}</span>
      </div>
    </button>
  `,
    styles: [`
    button {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      border: 1px solid transparent;
      outline: none;
    }

    .full-width {
      width: 100%;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
    }

    .btn-ghost {
      background: transparent;
      color: #94a3b8;
    }

    .btn-ghost:hover {
      background: rgba(30, 41, 59, 0.5);
      color: #cbd5e1;
      border-color: #334155;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      border-color: #3b82f6;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      color: white;
    }

    .btn-primary:active {
      transform: translateY(1px);
    }
  `]
})
export class ButtonBaseComponent {
    iconName = input<string>();
    label = input.required<string>();
    variant = input<'primary' | 'ghost'>('primary');
    iconSize = input<number>(18);
    fullWidth = input<boolean>(false);
    tooltip = input<string>('');
    btnClick = output<MouseEvent>();
}
