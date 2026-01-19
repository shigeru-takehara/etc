/**
 * Reusable Slider Component
 * 
 * Usage:
 * <app-slider 
 *   [value]="currentValue" 
 *   [min]="0" 
 *   [max]="100" 
 *   [step]="1"
 *   [accentColor]="'#0ea5e9'" 
 *   (valueChange)="onValueChange($event)"
 * ></app-slider>
 * 
 * Inputs:
 * - value (required): number - current value of the slider
 * - min (optional): number - minimum value (default: 0)
 * - max (optional): number - maximum value (default: 100)
 * - step (optional): number - step size (default: 1)
 * - accentColor (optional): string - color of the slider track (default: #0ea5e9)
 * 
 * Outputs:
 * - valueChange: number - emitted when the slider value changes
 */
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-slider',
    standalone: true,
    imports: [CommonModule],
    template: `
    <input 
      type="range" 
      [min]="min()" 
      [max]="max()" 
      [step]="step()"
      [value]="value()" 
      (input)="onInput($event)"
      class="slider-input"
      [style.accent-color]="accentColor()"
    />
  `,
    styles: [`
    :host { display: block; width: 100%; }
    .slider-input { 
      width: 100%; 
      height: 0.25rem; 
      background: #334155; 
      border-radius: 0.5rem; 
      cursor: pointer; 
      display: block;
    }
  `]
})
export class AppSliderComponent {
    value = input.required<number>();
    min = input<number>(0);
    max = input<number>(100);
    step = input<number>(1);
    accentColor = input<string>('#0ea5e9');
    valueChange = output<number>();

    onInput(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        this.valueChange.emit(parseFloat(val));
    }
}
