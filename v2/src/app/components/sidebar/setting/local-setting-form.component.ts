import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { RagConfig } from '../../../services/rag.service';
import { SettingFieldComponent } from './setting-field.component';
import { TemperatureSliderComponent } from './temperature-slider.component';
import { TestConnectionButtonComponent } from './test-connection-button.component';

@Component({
  selector: 'app-local-setting-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    SettingFieldComponent,
    TemperatureSliderComponent,
    TestConnectionButtonComponent
  ],
  template: `
    <div class="space-y-4">
      <div style="padding: 0.75rem; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <p style="font-size: 0.75rem; color: #7dd3fc; margin: 0; font-weight: 500;">
            Internal Knowledge Base: Active indexing and search.
          </p>
      </div>

      <app-setting-field label="Local LLM Base URL">
        <input type="text" [(ngModel)]="config().baseUrl" />
      </app-setting-field>

      <app-setting-field label="Chat Model">
        <input type="text" [(ngModel)]="config().chatModel" />
      </app-setting-field>

      <app-setting-field label="Embedding Model">
        <input type="text" [(ngModel)]="config().embeddingModel" />
      </app-setting-field>

      <app-temperature-slider
        [value]="config().temperature || 0"
        (valueChange)="config().temperature = $event"
      ></app-temperature-slider>

      <app-test-connection-button
        label="Test Local Connection"
        [testing]="testing()"
        [status]="status()"
        (test)="test()"
      ></app-test-connection-button>
    </div>
  `,
  styles: []
})
export class LocalSettingFormComponent {
  config = input.required<RagConfig>();

  testing = signal(false);
  status = signal<'idle' | 'success' | 'error'>('idle');

  private api = inject(ApiService);

  async test() {
    this.testing.set(true);
    this.status.set('idle');
    const success = await this.api.testConnection(this.config().baseUrl);
    this.status.set(success ? 'success' : 'error');
    this.testing.set(false);
  }
}
