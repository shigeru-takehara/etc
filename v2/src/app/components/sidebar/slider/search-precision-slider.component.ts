import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderBaseComponent } from '../../base/slider-base.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-search-precision-slider',
    standalone: true,
    imports: [CommonModule, SliderBaseComponent],
    template: `
    <app-slider-base
      label="Search Precision"
      iconName="target"
      tooltip="Minimum confidence level required to select a document segment."
      [min]="0"
      [max]="100"
      [value]="percentValue()"
      [displayValue]="displayValue()"
      (valueChange)="onValueChange($event)"
    ></app-slider-base>
  `
})
export class SearchPrecisionSliderComponent {
    ragService = inject(RagService);

    percentValue = computed(() => Math.round(this.ragService.similarityThreshold() * 100));
    displayValue = computed(() => `${this.percentValue()}%`);

    onValueChange(newPercent: number) {
        this.ragService.similarityThreshold.set(newPercent / 100);
    }
}
