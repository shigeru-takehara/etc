/**
 * Base Slider Component with Label, Icon and Value Display
 * 
 * Usage:
 * <app-slider-base
 *   label="Volume"
 *   iconName="volume-2"
 *   [value]="volume"
 *   [displayValue]="volume + '%'"
 *   (valueChange)="volume = $event"
 * ></app-slider-base>
 * 
 * Inputs:
 * - label (required): string - text label next to slider
 * - iconName (required): string - lucide icon name
 * - tooltip (optional): string - help text for the row
 * - value (required): number - actual slider value
 * - displayValue (required): string | number - formatted value to show in UI
 * - min/max/step (optional): numbers for range configuration
 * 
 * Outputs:
 * - valueChange: number - emitted when slider value is updated
 */
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AppSliderComponent } from './app-slider.component';
import { LabeledIconComponent } from './labeled-icon.component';

@Component({
  selector: 'app-slider-base',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppSliderComponent, LabeledIconComponent],
  template: `
    <div class="slider-row" [title]="tooltip()">
      <div class="slider-header">
        <app-labeled-icon
          [iconName]="iconName()"
          [label]="label()"
        ></app-labeled-icon>
        <span class="value-display">{{ displayValue() }}</span>
      </div>
      <app-slider
        [value]="value()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        (valueChange)="valueChange.emit($event)"
      ></app-slider>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .slider-row { padding: 0 0.5rem 1rem; }
    .slider-header { display: flex; justify-content: space-between; font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.5rem; }
    .label-text { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
    .value-display { color: #38bdf8; font-family: monospace; font-size: 0.75rem; }
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
