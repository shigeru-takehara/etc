/**
 * Reusable Icon + Title Component
 * 
 * Usage:
 * <app-icon-title-base 
 *   iconName="shield" 
 *   label="Security"
 *   size="default"
 * ></app-icon-title-base>
 * 
 * Inputs:
 * - iconName (required): string - lucide icon name
 * - label (required): string - text label
 * - iconColor (optional): string - hex or css color (default: #64748b)
 * - size (optional): 'default' | 'large' - preset sizing (default: 'default')
 */
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-icon-title-base',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="icon-title-row" [style.gap]="gap()">
      <lucide-icon 
        [name]="iconName()" 
        [size]="iconSize()" 
        [style.color]="iconColor()"
      ></lucide-icon>
      <span 
        class="label-text"
        [style.font-size]="fontSize()"
      >
        {{ label() }}
      </span>
    </div>
  `,
    styles: [`
    .icon-title-row {
      display: flex;
      align-items: center;
    }
    .label-text {
      font-weight: 500;
      color: #cbd5e1;
    }
  `]
})
export class IconTitleBaseComponent {
    iconName = input.required<string>();
    label = input.required<string>();
    iconColor = input<string>('#64748b');
    size = input<'default' | 'large'>('default');

    iconSize = computed(() => this.size() === 'large' ? 20 : 16);
    fontSize = computed(() => this.size() === 'large' ? '1.25rem' : '0.875rem');
    gap = computed(() => this.size() === 'large' ? '0.75rem' : '0.5rem');
}
