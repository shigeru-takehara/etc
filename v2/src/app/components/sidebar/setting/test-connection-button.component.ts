import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconTitleBaseComponent } from '../../base/icon-title-base.component';

@Component({
  selector: 'app-test-connection-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, IconTitleBaseComponent],
  template: `
    <button 
      (click)="test.emit()" 
      class="test-btn"
      [disabled]="testing()"
    >
      <app-icon-title-base
        [iconName]="view().icon"
        [label]="view().label"
        [iconColor]="view().color"
      ></app-icon-title-base>
    </button>
  `,
  styles: [`
    .test-btn {
      width: 100%;
      padding: 0.75rem;
      background: #1e293b;
      border: 1px solid transparent;
      border-radius: 0.5rem;
      color: #cbd5e1;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .test-btn:hover:not(:disabled) {
      background: #334155;
      color: white;
    }
    .test-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class TestConnectionButtonComponent {
  label = input.required<string>();
  testing = input.required<boolean>();
  status = input.required<'idle' | 'success' | 'error'>();
  test = output<void>();

  view = computed(() => {
    if (this.testing()) {
      return { icon: 'activity', color: '#94a3b8', label: 'Testing...' };
    }

    switch (this.status()) {
      case 'success':
        return { icon: 'check', color: '#4ade80', label: 'Connection Verified' };
      case 'error':
        return { icon: 'alert-circle', color: '#f87171', label: 'Connection Failed' };
      default:
        return { icon: 'activity', color: '#94a3b8', label: this.label() };
    }
  });
}
