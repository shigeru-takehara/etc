import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Bot } from 'lucide-angular';
import { Message } from '../services/rag.service';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div 
      class="chat-bubble"
      [ngClass]="message().role === 'user' ? 'bubble-user' : 'bubble-assistant'"
    >
      <div 
        class="icon-box shadow-lg"
        [ngClass]="message().role === 'user' ? 'icon-user' : 'icon-bot'"
      >
        <ng-container *ngIf="message().role === 'user'; else botIcon">
          <lucide-icon [name]="'user'" [size]="20"></lucide-icon>
        </ng-container>
        <ng-template #botIcon>
          <lucide-icon [name]="'bot'" [size]="20"></lucide-icon>
        </ng-template>
      </div>

      <div class="flex-1 space-y-2 overflow-hidden">
        <p class="text-xs font-bold uppercase tracking-widest" [ngClass]="message().role === 'user' ? 'text-slate-500' : 'text-primary-400'" style="margin-bottom: 0.5rem;">
          {{ message().role === 'user' ? 'You' : 'Assistant' }}
        </p>
        <div class="text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
          {{ message().content }}
        </div>
      </div>
    </div>
  `
})
export class ChatBubbleComponent {
  message = input.required<Message>();
}
