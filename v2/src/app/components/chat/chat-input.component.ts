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
          style="padding: 0.5rem 1rem; margin-right: 0.5rem;"
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
