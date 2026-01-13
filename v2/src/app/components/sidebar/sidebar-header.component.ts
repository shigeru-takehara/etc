import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-sidebar-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="sidebar-header">
      <h1 class="text-xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2" style="display: flex; align-items: center;">
        <lucide-icon [name]="'cpu'" class="text-primary-500"></lucide-icon> RAG Assistant
      </h1>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class SidebarHeaderComponent { }
