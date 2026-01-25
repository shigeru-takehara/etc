import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Unified Component for Icon + Label layouts.
 * Uses host bindings for behavior and appearance, avoiding template conditional blocks.
 */
@Component({
    selector: 'app-labeled-icon',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    @if (iconName()) {
      <lucide-icon 
        [name]="iconName()!" 
        [size]="computedIconSize()"
        [style.color]="iconColor() === '#64748b' && clickable() && variant() !== 'none' ? null : iconColor()"
      ></lucide-icon>
    }
    <span class="label" [style.font-size]="computedFontSize()">{{ label() }}</span>
  `,
    host: {
        '[class.clickable]': 'clickable()',
        '[class.full-width]': 'fullWidth()',
        '[class.variant-primary]': 'clickable() && variant() === "primary"',
        '[class.variant-ghost]': 'clickable() && variant() === "ghost"',
        '[class.variant-none]': 'clickable() && variant() === "none"',
        '[style.gap]': 'computedGap()',
        '[attr.title]': 'tooltip()',
        '(click)': 'onClick($event)'
    },
    styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      transition: all 0.2s;
      font-weight: 500;
      color: #cbd5e1;
      border: 1px solid transparent;
    }

    :host.clickable {
      cursor: pointer;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      outline: none;
    }

    :host.full-width {
      width: 100%;
      justify-content: center;
    }

    :host.variant-ghost {
      background: transparent;
      color: #94a3b8;
    }
    :host.variant-ghost:hover {
      background: rgba(30, 41, 59, 0.5);
      color: #cbd5e1;
      border-color: #334155;
    }

    :host.variant-primary {
      background: #2563eb;
      color: white;
      border-color: #3b82f6;
    }
    :host.variant-primary:hover {
      background: #1d4ed8;
      color: white;
    }
    :host.variant-primary:active {
      transform: translateY(1px);
    }

    :host.variant-none {
      background: transparent;
      padding: 0;
      border: none;
      color: inherit;
    }

    .label {
      line-height: 1;
    }
  `]
})
export class LabeledIconComponent {
    iconName = input<string>();
    label = input.required<string>();

    // Sizing properties
    size = input<'default' | 'large'>('default');
    iconSize = input<number>(); // Override default size
    iconColor = input<string>('#64748b');

    // Interaction properties
    clickable = input<boolean>(false);
    variant = input<'primary' | 'ghost' | 'none'>('primary');
    fullWidth = input<boolean>(false);
    tooltip = input<string>('');

    btnClick = output<MouseEvent>();

    computedIconSize = computed(() => {
        if (this.iconSize()) return this.iconSize()!;
        return this.size() === 'large' ? 20 : 16;
    });

    computedFontSize = computed(() => {
        return this.size() === 'large' ? '1.25rem' : '0.875rem';
    });

    computedGap = computed(() => {
        return this.size() === 'large' ? '0.75rem' : '0.5rem';
    });

    onClick(event: MouseEvent) {
        if (this.clickable()) {
            this.btnClick.emit(event);
        }
    }
}
