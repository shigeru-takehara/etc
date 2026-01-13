import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleBaseComponent } from '../../base/toggle-base.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-enable-knowledge-toggle',
    standalone: true,
    imports: [CommonModule, ToggleBaseComponent],
    template: `
    <app-toggle-base
      label="Enable Knowledge"
      iconName="database"
      iconColor="#0ea5e9"
      tooltip="Enable or disable document retrieval for your questions."
      [isActive]="ragService.isRagEnabled()"
      (toggle)="ragService.isRagEnabled.set(!ragService.isRagEnabled())"
    ></app-toggle-base>
  `
})
export class EnableKnowledgeToggleComponent {
    ragService = inject(RagService);
}
