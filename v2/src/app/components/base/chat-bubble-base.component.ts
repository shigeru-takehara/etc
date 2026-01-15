import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { ChatRole, CHAT_ROLES } from '../../models/chat.model';

@Component({
    selector: 'app-chat-bubble-base',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div 
      class="chat-bubble"
      [ngClass]="role() === CHAT_ROLES.USER ? 'bubble-user' : 'bubble-assistant'"
    >
      <div 
        class="icon-box shadow-lg"
        [ngClass]="role() === CHAT_ROLES.USER ? 'icon-user' : 'icon-bot'"
      >
        <lucide-icon [name]="iconName()" [size]="20"></lucide-icon>
      </div>

      <div class="flex-1 space-y-2 overflow-hidden">
        <p class="text-xs font-bold uppercase tracking-widest" [ngClass]="role() === CHAT_ROLES.USER ? 'text-slate-500' : 'text-primary-400'" style="margin-bottom: 0.5rem;">
          {{ label() }}
        </p>
        <div class="flex items-start gap-2 group">
          <div class="text-slate-200 leading-relaxed whitespace-pre-wrap break-words flex-1" [innerHTML]="renderedContent()"></div>
          <button (click)="copyContent()" 
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md" 
                  title="Copy original Markdown">
            <lucide-icon name="copy" [size]="14"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatBubbleBaseComponent {
    CHAT_ROLES = CHAT_ROLES;
    role = input.required<ChatRole>();
    iconName = input.required<string>();
    label = input.required<string>();
    content = input.required<string>();

    constructor(private sanitizer: DomSanitizer) { }

    renderedContent(): SafeHtml {
        const html = marked.parse(this.content() || '') as string;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    copyContent(): void {
        const raw = this.content() || '';
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(raw).catch(err => console.error('Copy failed', err));
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = raw;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (e) {
                console.error('Fallback copy failed', e);
            }
            document.body.removeChild(textarea);
        }
    }
}
