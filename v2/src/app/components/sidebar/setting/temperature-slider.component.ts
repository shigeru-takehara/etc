import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderBaseComponent } from '../../base/slider-base.component';

@Component({
    selector: 'app-temperature-slider',
    standalone: true,
    imports: [CommonModule, SliderBaseComponent],
    template: `
    <app-slider-base
      label="Temperature (Creativity)"
      iconName="thermometer"
      tooltip="0.0 = Focused/Deterministic, 1.0 = Balanced, 2.0 = Random/Creative."
      [min]="0"
      [max]="2"
      [step]="0.1"
      [value]="value()"
      [displayValue]="value()"
      (valueChange)="valueChange.emit($event)"
    ></app-slider-base>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class TemperatureSliderComponent {
    value = input.required<number>();
    valueChange = output<number>();
}
