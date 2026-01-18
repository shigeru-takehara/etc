import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-slider-base',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="slider-row" [title]="tooltip()">
      <div class="slider-header">
        <span class="label-text">
          <lucide-icon [name]="iconName()" style="color: #64748b;" [size]="16"></lucide-icon>
          {{ label() }}
        </span>
        <span class="value-display">{{ displayValue() }}</span>
      </div>
      <input 
        type="range" 
        [min]="min()" 
        [max]="max()" 
        [step]="step()"
        [value]="value()" 
        (input)="onInput($event)"
        class="slider-input"
      />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .slider-row { padding: 0 0.5rem 1rem; }
    .slider-header { display: flex; justify-content: space-between; font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.5rem; }
    .label-text { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
    .value-display { color: #38bdf8; font-family: monospace; font-size: 0.75rem; }
    .slider-input { width: 100%; height: 0.25rem; background: #334155; border-radius: 0.5rem; cursor: pointer; accent-color: #0ea5e9; }
  `]
})
export class SliderBaseComponent {
  label = input.required<string>();
  iconName = input.required<string>();
  tooltip = input<string>('');
  value = input.required<number>();
  displayValue = input.required<string | number>();
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  valueChange = output<number>();

  onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.valueChange.emit(parseFloat(val));
  }
}
