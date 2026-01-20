import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-welcome-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div class="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <lucide-icon [name]="'message-square'" [size]="48" class="text-primary-500 relative"></lucide-icon>
      </div>
      <div class="space-y-2">
        <h2 class="text-3xl font-bold text-white tracking-tight">AI Knowledge Assistant</h2>
        <p class="text-slate-400 max-w-md mx-auto leading-relaxed">
          Upload documents to create your local knowledge base. Search and reason over your data securely.
        </p>
      </div>
      <div class="flex items-center gap-6 pt-4">
        <div class="badge-label">
          <lucide-icon [name]="'shield-check'" [size]="14"></lucide-icon> 100% Local Privacy
        </div>
        <div class="w-1 h-1 bg-slate-800 rounded-full"></div>
        <div class="badge-label">
          High Performance
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge-label {
      @apply flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest;
    }
  `]
})
export class WelcomeHeaderComponent { }
