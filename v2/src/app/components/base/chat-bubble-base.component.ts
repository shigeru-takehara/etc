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
        class="icon-box"
        [ngClass]="role() === CHAT_ROLES.USER ? 'icon-user' : 'icon-bot'"
      >
        <lucide-icon [name]="iconName()" [size]="20"></lucide-icon>
      </div>

      <div class="flex-1 space-y-2 overflow-hidden">
        <p class="text-xs font-bold uppercase tracking-widest" [ngClass]="role() === CHAT_ROLES.USER ? 'text-slate-500' : 'text-primary-400'" style="margin-bottom: 0.5rem;">
          {{ label() }}
        </p>
        <div class="flex items-start gap-2 group">
          <div class="markdown-content text-slate-200 leading-relaxed break-words flex-1" [innerHTML]="renderedContent()"></div>
          <button (click)="copyContent()" 
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md" 
                  title="Copy original Markdown">
            <lucide-icon name="copy" [size]="14"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .chat-bubble {
      @apply flex gap-4 p-6 rounded-[1.25rem] mb-8 animate-[slideIn_0.3s_ease-out];
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .bubble-user {
      @apply bg-slate-800/40;
    }

    .bubble-assistant {
      @apply bg-sky-500/5 border border-sky-500/10;
    }

    .icon-box {
      @apply w-10 h-10 rounded-xl flex items-center justify-center shadow-lg;
      flex-shrink: 0;
    }

    .icon-user {
      @apply bg-slate-700 text-slate-300;
    }

    .icon-bot {
      @apply bg-sky-500 text-white;
    }

    /* Markdown Specific Styles */
    .markdown-content p {
      margin-bottom: 1rem;
    }
    
    .markdown-content p:last-child {
      margin-bottom: 0;
    }

    .markdown-content h1, .markdown-content h2, .markdown-content h3 {
      margin: 1.5rem 0 1rem;
      font-weight: 700;
      color: #fff;
    }
    
    .markdown-content h1 { font-size: 1.5rem; }
    .markdown-content h2 { font-size: 1.25rem; }
    .markdown-content h3 { font-size: 1.125rem; }

    .markdown-content ul, .markdown-content ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    .markdown-content ul {
      list-style-type: disc;
    }

    .markdown-content ol {
      list-style-type: decimal;
    }

    .markdown-content li {
      margin-bottom: 0.5rem;
    }

    .markdown-content code {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875em;
    }

    .markdown-content pre {
      background: #0f172a;
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      overflow-x: auto;
      border: 1px solid #1e293b;
    }

    .markdown-content pre code {
      background: transparent;
      padding: 0;
      border-radius: 0;
      font-size: 0.875rem;
      color: #e2e8f0;
    }

    .markdown-content strong {
      font-weight: 700;
      color: #38bdf8;
    }

    .markdown-content blockquote {
      border-left: 4px solid #38bdf8;
      background: rgba(56, 189, 248, 0.05);
      padding: 0.5rem 1rem;
      margin: 1rem 0;
      color: #94a3b8;
    }

    @media (max-height: 850px) {
      .chat-bubble {
        padding: 1rem;
        margin-bottom: 1rem;
      }
    }
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
