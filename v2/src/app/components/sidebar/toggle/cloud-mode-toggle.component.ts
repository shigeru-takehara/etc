import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleBaseComponent } from '../../base/toggle-base.component';
import { RagService } from '../../../services/rag.service';

@Component({
    selector: 'app-cloud-mode-toggle',
    standalone: true,
    imports: [CommonModule, ToggleBaseComponent],
    template: `
    <app-toggle-base
      [label]="label()"
      iconName="cpu"
      tooltip="Switch between local LLM and cloud-based models."
      [isActive]="ragService.useCloud()"
      activeBg="#0284c7"
      (toggle)="ragService.useCloud.set(!ragService.useCloud())"
    ></app-toggle-base>
  `
})
export class CloudModeToggleComponent {
    ragService = inject(RagService);

    label = computed(() => this.ragService.useCloud() ? 'Cloud mode' : 'Local mode');
}
