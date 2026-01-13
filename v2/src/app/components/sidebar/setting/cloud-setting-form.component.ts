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
  selector: 'app-cloud-setting-form',
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
      <app-setting-field label="Cloud API Base URL">
        <input type="text" [(ngModel)]="config().baseUrl" />
      </app-setting-field>

      <app-setting-field label="Cloud Model">
        <input type="text" [(ngModel)]="config().chatModel" />
      </app-setting-field>

      <app-setting-field label="API Key">
        <input type="password" [(ngModel)]="config().apiKey" placeholder="sk-..." />
      </app-setting-field>

      <app-temperature-slider
        [value]="config().temperature || 0"
        (valueChange)="config().temperature = $event"
      ></app-temperature-slider>

      <app-test-connection-button
        label="Test Cloud Connection"
        [testing]="testing()"
        [status]="status()"
        (test)="test()"
      ></app-test-connection-button>
    </div>
  `,
  styles: []
})
export class CloudSettingFormComponent {
  config = input.required<RagConfig>();

  testing = signal(false);
  status = signal<'idle' | 'success' | 'error'>('idle');

  private api = inject(ApiService);

  async test() {
    this.testing.set(true);
    this.status.set('idle');
    const success = await this.api.testConnection(this.config().baseUrl, this.config().apiKey);
    this.status.set(success ? 'success' : 'error');
    this.testing.set(false);
  }
}
