import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RagService } from '../../../services/rag.service';

@Component({
  selector: 'app-advanced-setting-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div style="padding: 1.25rem; background: rgba(30, 41, 59, 0.4); border: 1px solid #1e293b; border-radius: 0.75rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <div>
          <h3 style="font-size: 0.875rem; font-weight: 600; color: white; margin: 0;">Co-reference Engine</h3>
          <p style="font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0;">Resolves nouns like "it" or "he" for better RAG accuracy.</p>
        </div>
        <div [ngClass]="{
          'status-off': ragService.corefStatus() === 'off',
          'status-starting': ragService.corefStatus() === 'starting',
          'status-ready': ragService.corefStatus() === 'ready',
          'status-error': ragService.corefStatus() === 'error'
        }" class="status-badge">
          {{ ragService.corefStatus() }}
        </div>
      </div>

      <div *ngIf="ragService.corefStatus() === 'starting'" style="margin-bottom: 1.25rem;">
        <div style="height: 4px; background: #0f172a; border-radius: 2px; overflow: hidden;">
           <div class="progress-bar"></div>
        </div>
        <p style="font-size: 0.7rem; color: #38bdf8; margin-top: 0.5rem; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">
          Loading model into memory (approx 1 min)...
        </p>
      </div>

      <button 
        (click)="ragService.startCorefServer()" 
        [disabled]="ragService.corefStatus() === 'ready' || ragService.corefStatus() === 'starting'"
        class="engine-btn"
        [ngClass]="{'btn-ready': ragService.corefStatus() === 'ready'}"
      >
        <lucide-icon [name]="ragService.corefStatus() === 'ready' ? 'check-circle' : 'play'" [size]="16"></lucide-icon>
        {{ ragService.corefStatus() === 'ready' ? 'Engine Ready' : (ragService.corefStatus() === 'starting' ? 'Starting...' : 'Enable Engine') }}
      </button>

      @if (ragService.corefStatus() === 'ready') {
        <p style="font-size: 0.7rem; color: #34d399; margin-top: 0.75rem; text-align: center;">
          The engine is active and will automatically process incoming documents.
        </p>
      }
    </div>
  `,
  styles: [`
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .status-off { background: #1e293b; color: #64748b; }
    .status-starting { background: rgba(14, 165, 233, 0.2); color: #38bdf8; }
    .status-ready { background: rgba(52, 211, 153, 0.2); color: #34d399; }
    .status-error { background: rgba(248, 113, 113, 0.2); color: #f87171; }

    .progress-bar {
      height: 100%;
      width: 60%;
      background: #38bdf8;
      animation: progressMove 2s infinite linear;
    }

    @keyframes progressMove {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }

    .engine-btn {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #1e293b;
      color: #cbd5e1;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .engine-btn:hover:not(:disabled) {
      background: #334155;
      color: white;
    }
    .engine-btn:disabled {
      cursor: not-allowed;
    }
    .btn-ready {
      background: rgba(6, 78, 59, 0.4) !important;
      color: #34d399 !important;
      border: 1px solid rgba(52, 211, 153, 0.2);
    }
  `]
})
export class AdvancedSettingForm {
  ragService = inject(RagService);
}
