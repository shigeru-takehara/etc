import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setting-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="margin-bottom: 1.25rem;">
      <label class="block text-sm font-medium text-slate-400 mb-1.5" style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.375rem;">
        {{ label() }}
      </label>
      <ng-content></ng-content>
      @if (hint()) {
        <p style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem;">
          {{ hint() }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    :host ::ng-deep input,
    :host ::ng-deep select {
      width: 100%;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      padding: 0.625rem;
      color: white;
      outline: none;
      transition: border-color 0.2s;
    }
    :host ::ng-deep input:focus,
    :host ::ng-deep select:focus {
      border-color: rgba(56, 189, 248, 0.5);
    }
  `]
})
export class SettingFieldComponent {
  label = input.required<string>();
  hint = input<string>();
}
