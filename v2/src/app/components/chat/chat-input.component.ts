import { Component, model, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="input-wrapper">
      <div class="input-container">
        <input 
          type="text" 
          [(ngModel)]="userInput"
          name="userInput"
          placeholder="Ask your documents anything..." 
          class="chat-input"
          [disabled]="isProcessing()"
          (keyup.enter)="onSubmit()"
        />
        <button 
          type="button"
          (click)="onSubmit()"
          [disabled]="!userInput().trim() || isProcessing()"
          class="btn-primary"
        >
          <lucide-icon *ngIf="!isProcessing()" [name]="'send'" [size]="20"></lucide-icon>
          <lucide-icon *ngIf="isProcessing()" [name]="'loader-2'" class="animate-spin" [size]="20"></lucide-icon>
        </button>
      </div>
      <p class="text-center mt-2 text-[10px] uppercase tracking-[0.2em] font-medium" 
         [ngClass]="rewriteStatus() ? 'text-primary-400 animate-pulse' : 'text-slate-500'">
        {{ rewriteStatus() || 'Powered by Local Intelligence' }}
      </p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      flex-shrink: 0;
      z-index: 10;
      position: relative;
    }

    .input-wrapper {
      padding: 1.5rem;
      background: linear-gradient(to top, var(--bg-dark), transparent);
    }

    .input-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      background: #111827;
      border: 1px solid var(--border-slate);
      border-radius: 1rem;
      padding: 0.5rem 0.5rem 0.5rem 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      transition: border-color 0.2s ease;
    }

    .input-container:focus-within {
      border-color: var(--primary);
    }

    .chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-main);
      padding: 0.75rem 0;
      font-size: 1rem;
    }

    .btn-primary {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }

    @media (max-height: 850px) {
      .input-wrapper {
        padding: 0.75rem 1rem;
      }
      .input-container {
        padding: 0.25rem 0.25rem 0.25rem 1rem;
      }
    }
  `
})
export class ChatInputComponent {
  userInput = model('');
  isProcessing = input<boolean>(false);
  rewriteStatus = input<string | null>(null);
  submit = output<void>();

  onSubmit() {
    if (!this.userInput().trim() || this.isProcessing()) return;
    this.submit.emit();
  }
}
