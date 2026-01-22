import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-welcome-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="welcome-container">
      <div class="icon-box-wrapper">
        <div class="glow-effect"></div>
        <div class="icon-box">
          <lucide-icon [name]="'message-square'" [size]="48" class="main-icon"></lucide-icon>
        </div>
      </div>
      <div class="content-box">
        <h2 class="welcome-title">AI Knowledge Assistant</h2>
        <p class="welcome-description">
          Upload documents to create your local knowledge base. Search and reason over your data securely.
        </p>
      </div>
      <div class="badge-container">
        <div class="badge-item">
          <lucide-icon [name]="'shield-check'" [size]="14"></lucide-icon> <span>100% Local Privacy</span>
        </div>
        <div class="badge-separator"></div>
        <div class="badge-item">
          <span>High Performance</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .welcome-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 0;
      text-align: center;
      gap: 1.5rem;
    }

    .icon-box-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }

    .glow-effect {
      position: absolute;
      inset: -4px;
      background: linear-gradient(to right, var(--primary), #06b6d4);
      border-radius: 1.5rem;
      filter: blur(8px);
      opacity: 0.2;
      transition: opacity 1s;
    }

    .icon-box-wrapper:hover .glow-effect {
      opacity: 0.4;
    }

    .icon-box {
      position: relative;
      padding: 1.5rem;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 96px;
      height: 96px;
    }

    .main-icon {
      color: var(--primary);
    }

    .content-box {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .welcome-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: white;
      letter-spacing: -0.025em;
      margin: 0;
    }

    .welcome-description {
      font-size: 1rem;
      color: #94a3b8;
      max-width: 28rem;
      margin: 0 auto;
      line-height: 1.625;
    }

    .badge-container {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-top: 1rem;
    }

    .badge-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .badge-separator {
      width: 4px;
      height: 4px;
      background: #1e293b;
      border-radius: 9999px;
    }

    @media (max-height: 850px) {
      .welcome-container {
        padding: 2.5rem 0;
      }
      .welcome-title {
        font-size: 1.5rem !important;
      }
    }
  `]
})
export class WelcomeHeaderComponent { }
