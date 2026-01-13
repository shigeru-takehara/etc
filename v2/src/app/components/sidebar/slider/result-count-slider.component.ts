import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderBaseComponent } from '../../base/slider-base.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-result-count-slider',
    standalone: true,
    imports: [CommonModule, SliderBaseComponent],
    template: `
    <app-slider-base
      label="Result Count"
      iconName="search"
      tooltip="Maximum number of relevant document segments to find."
      [min]="1"
      [max]="20"
      [value]="ragService.topK()"
      [displayValue]="ragService.topK()"
      (valueChange)="ragService.topK.set($event)"
    ></app-slider-base>
  `
})
export class ResultCountSliderComponent {
    ragService = inject(RagService);
}
