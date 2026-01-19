/**
 * Reusable Markdown Rendering Component (powered by ngx-markdown)
 * 
 * Usage:
 * <app-markdown [content]="markdownString"></app-markdown>
 * 
 * Inputs:
 * - content (required): string - markdown text to render
 */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

// Import PrismJS and popular languages for syntax highlighting
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-bash.min.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-markdown.min.js';

@Component({
    selector: 'app-markdown',
    standalone: true,
    imports: [CommonModule, MarkdownComponent],
    template: `
    <markdown 
      [data]="content()" 
      class="markdown-content"
    ></markdown>
  `,
    styles: [`
    :host { display: block; }
    
    .markdown-content {
      color: #e2e8f0;
      line-height: 1.625;
      overflow-wrap: break-word;
    }

    /* Custom overrides for ngx-markdown default styling */
    ::ng-deep .markdown-content p {
      margin-bottom: 1rem;
    }
    
    ::ng-deep .markdown-content p:last-child {
      margin-bottom: 0;
    }

    ::ng-deep .markdown-content h1, 
    ::ng-deep .markdown-content h2, 
    ::ng-deep .markdown-content h3 {
      margin: 1.5rem 0 1rem;
      font-weight: 700;
      color: #fff;
    }
    
    ::ng-deep .markdown-content h1 { font-size: 1.5rem; }
    ::ng-deep .markdown-content h2 { font-size: 1.25rem; }
    ::ng-deep .markdown-content h3 { font-size: 1.125rem; }

    ::ng-deep .markdown-content ul, 
    ::ng-deep .markdown-content ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    ::ng-deep .markdown-content ul { list-style-type: disc; }
    ::ng-deep .markdown-content ol { list-style-type: decimal; }
    ::ng-deep .markdown-content li { margin-bottom: 0.5rem; }

    ::ng-deep .markdown-content code {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875em;
    }

    ::ng-deep .markdown-content pre {
      background: #0f172a !important;
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      overflow-x: auto;
      border: 1px solid #1e293b;
    }

    ::ng-deep .markdown-content pre code {
      background: transparent !important;
      padding: 0;
      border-radius: 0;
      font-size: 0.875rem;
      color: #e2e8f0;
    }

    ::ng-deep .markdown-content strong {
      font-weight: 700;
      color: #38bdf8;
    }

    ::ng-deep .markdown-content blockquote {
      border-left: 4px solid #38bdf8;
      background: rgba(56, 189, 248, 0.05);
      padding: 0.5rem 1rem;
      margin: 1rem 0;
      color: #94a3b8;
    }
  `]
})
export class AppMarkdownComponent {
    content = input.required<string>();
}
