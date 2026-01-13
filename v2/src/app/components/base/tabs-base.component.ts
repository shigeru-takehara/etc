import { Component, input, output, contentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TabBaseComponent } from './tab-base.component';

@Component({
    selector: 'app-tabs-base',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="tabs-container">
      <!-- Tab Header -->
      <div class="tabs-header">
        @for (tab of tabs(); track tab.id()) {
          <button 
            (click)="selectTab(tab.id())"
            [class.active]="activeId() === tab.id()"
            class="tab-btn"
          >
            <lucide-icon [name]="tab.icon()" [size]="18"></lucide-icon>
            <span class="tab-label">{{ tab.label() }}</span>
            @if (activeId() === tab.id()) {
              <div class="active-indicator"></div>
            }
          </button>
        }
      </div>

      <!-- Tab Content Area -->
      <div class="tabs-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .tabs-container { display: flex; flex-direction: column; height: 100%; }
    
    .tabs-header { 
      display: flex; 
      border-bottom: 1px solid #1e293b; 
      background: rgba(15, 23, 42, 0.3);
    }
    
    .tab-btn { 
      flex: 1; 
      padding: 1rem; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 0.625rem; 
      background: transparent; 
      border: none; 
      cursor: pointer; 
      position: relative;
      color: #94a3b8;
      transition: all 0.2s;
      font-weight: 500;
    }
    
    .tab-btn:hover {
      color: #cbd5e1;
      background: rgba(56, 189, 248, 0.02);
    }
    
    .tab-btn.active {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.05);
    }
    
    .active-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #38bdf8;
      box-shadow: 0 -2px 10px rgba(56, 189, 248, 0.3);
    }
    
    .tab-label { font-size: 0.875rem; }
    
    .tabs-content { flex: 1; padding-top: 1.5rem; }
  `]
})
export class TabsBaseComponent {
    activeId = input.required<string>();
    activeIdChange = output<string>();

    tabs = contentChildren(TabBaseComponent);

    selectTab(id: string) {
        this.activeIdChange.emit(id);
    }
}
