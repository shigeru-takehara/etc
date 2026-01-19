/**
 * Reusable Markdown Rendering Component (Manual Parsing)
 * 
 * Usage:
 * <app-markdown-base [content]="markdownString"></app-markdown-base>
 * 
 * Inputs:
 * - content (required): string - markdown text to render
 */
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
    selector: 'app-markdown-base',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="markdown-content" [innerHTML]="renderedContent()"></div>`,
    styles: [`
    :host { display: block; }
    
    .markdown-content {
      color: #e2e8f0;
      line-height: 1.625;
      overflow-wrap: break-word;
    }

    .markdown-content p { margin-bottom: 1rem; }
    .markdown-content p:last-child { margin-bottom: 0; }

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

    .markdown-content ul { list-style-type: disc; }
    .markdown-content ol { list-style-type: decimal; }
    .markdown-content li { margin-bottom: 0.5rem; }

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
  `]
})
export class MarkdownBaseComponent {
    content = input.required<string>();
    private sanitizer = inject(DomSanitizer);

    renderedContent(): SafeHtml {
        const html = marked.parse(this.content() || '') as string;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
