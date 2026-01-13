import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleBaseComponent } from '../../base/toggle-base.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-smart-split-toggle',
    standalone: true,
    imports: [CommonModule, ToggleBaseComponent],
    template: `
    <app-toggle-base
      label="Smart Split"
      iconName="layers"
      tooltip="Automatically divides large documents into smaller parts for better search results."
      [isActive]="ragService.isChunkingEnabled()"
      activeBg="#0284c7"
      (toggle)="ragService.isChunkingEnabled.set(!ragService.isChunkingEnabled())"
    ></app-toggle-base>
  `
})
export class SmartSplitToggleComponent {
    ragService = inject(RagService);
}
