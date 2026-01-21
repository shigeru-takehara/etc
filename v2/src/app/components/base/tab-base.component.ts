/**
 * Individual Tab Content Component (to be used within app-tabs-base)
 * 
 * Usage:
 * <app-tab-base id="settings" label="Settings" icon="settings">
 *   <div>Settings content...</div>
 * </app-tab-base>
 * 
 * Inputs:
 * - id (required): string - unique identifier for the tab
 * - label (required): string - display name for the tab
 * - icon (required): string - lucide icon name for the tab header
 */
import { Component, input, inject, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsBaseComponent } from './tabs-base.component';

@Component({
  selector: 'app-tab-base',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isActive()) {
      <div class="tab-content h-full">
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: [`
    :host { display: block; height: 100%; }
    :host(:not(.active)) { display: none; }
    .tab-content { height: 100%; }
  `]
})
export class TabBaseComponent {
  private parent = inject(TabsBaseComponent);

  id = input.required<string>();
  label = input.required<string>();
  icon = input.required<string>();

  isActive = computed(() => this.parent.activeId() === this.id());

  @HostBinding('class.active') get activeClass() {
    return this.isActive();
  }
}
