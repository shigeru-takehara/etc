/**
 * Base Chat Bubble Component
 * 
 * Usage:
 * <app-chat-bubble-base
 *   [role]="CHAT_ROLES.USER"
 *   iconName="user"
 *   label="You"
 *   [content]="messageText"
 * ></app-chat-bubble-base>
 * 
 * Inputs:
 * - role (required): ChatRole - determines the bubble's styling (user vs assistant)
 * - iconName (required): string - lucide icon name for the bubble
 * - label (required): string - display name shown above the content
 * - content (required): string - markdown text to render inside the bubble
 */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChatRole, CHAT_ROLES } from '../../models/chat.model';
import { AppMarkdownComponent } from './app-markdown.component';

@Component({
  selector: 'app-chat-bubble-base',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppMarkdownComponent],
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
          <app-markdown 
            [content]="content()" 
            class="text-slate-200 leading-relaxed break-words flex-1"
          ></app-markdown>
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
