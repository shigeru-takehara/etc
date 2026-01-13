import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-test-connection-button',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <button 
      (click)="test.emit()" 
      class="test-btn"
      [disabled]="testing()"
    >
      <lucide-icon 
        [name]="status() === 'success' ? 'check' : (status() === 'error' ? 'alert-circle' : 'activity')" 
        [size]="16"
        [style.color]="status() === 'success' ? '#4ade80' : (status() === 'error' ? '#f87171' : '#94a3b8')"
      ></lucide-icon>
      {{ testing() ? 'Testing...' : (status() === 'success' ? 'Connection Verified' : (status() === 'error' ? 'Connection Failed' : label())) }}
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
}
