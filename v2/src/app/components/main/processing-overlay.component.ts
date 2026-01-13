import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-processing-overlay',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div *ngIf="isVisible()" class="absolute top-0 left-0 right-0 z-40">
      <div class="h-1 bg-slate-800 overflow-hidden">
        <div class="h-full bg-primary-500 animate-progress w-1/3"></div>
      </div>
      <div class="bg-primary-500/10 backdrop-blur-md px-6 py-2 flex items-center justify-between border-b border-primary-500/20">
        <div class="flex items-center gap-3">
          <lucide-icon [name]="'loader-2'" class="animate-spin text-primary-400" [size]="14"></lucide-icon>
          <span class="text-xs font-semibold text-primary-300 uppercase tracking-widest">{{ statusText() || 'Processing Intelligence...' }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .animate-progress {
      animation: progress 2s linear infinite;
    }
    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }
  `]
})
export class ProcessingOverlayComponent {
    isVisible = input.required<boolean>();
    statusText = input<string | null>(null);
}
