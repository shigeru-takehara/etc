import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Bot, Copy } from 'lucide-angular';
import { Message } from '../services/rag.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

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
        <div class="flex items-start gap-2 group">
          <div class="text-slate-200 leading-relaxed whitespace-pre-wrap break-words flex-1" [innerHTML]="renderMarkdown(message().content)"></div>
          <button (click)="copyMarkdown()" 
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md" 
                  title="Copy original Markdown">
            <lucide-icon name="copy" [size]="14"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatBubbleComponent {
  message = input.required<Message>();
  constructor(private sanitizer: DomSanitizer) { }
  renderMarkdown(md: string): SafeHtml {
    const html = marked.parse(md || '') as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  copyMarkdown(): void {
    // Copy the raw markdown source (not the rendered HTML)
    const raw = this.message().content || '';
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(raw).then(() => {
        console.log('Markdown copied to clipboard');
      }).catch(err => console.error('Copy failed', err));
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = raw;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Markdown copied (fallback)');
      } catch (e) {
        console.error('Fallback copy failed', e);
      }
      document.body.removeChild(textarea);
    }
  }
}
