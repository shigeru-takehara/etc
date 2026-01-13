import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleBaseComponent } from '../../base/toggle-base.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-smart-search-toggle',
    standalone: true,
    imports: [CommonModule, ToggleBaseComponent],
    template: `
    <app-toggle-base
      label="Smart Search"
      iconName="sparkles"
      tooltip="Uses AI to rephrase your questions for more accurate results."
      [isActive]="ragService.isQueryRewritingEnabled()"
      activeBg="#0284c7"
      (toggle)="ragService.isQueryRewritingEnabled.set(!ragService.isQueryRewritingEnabled())"
    ></app-toggle-base>
  `
})
export class SmartSearchToggleComponent {
    ragService = inject(RagService);
}
