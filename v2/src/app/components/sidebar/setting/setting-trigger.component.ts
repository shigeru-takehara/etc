import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonBaseComponent } from '../../base/button-base.component';

@Component({
  selector: 'app-setting-trigger',
  standalone: true,
  imports: [CommonModule, ButtonBaseComponent],
  template: `
    <app-button-base
      [iconName]="'settings'"
      [label]="'Configure Provider'"
      [tooltip]="'Configure AI Provider and Models'"
      [variant]="'ghost'"
      [fullWidth]="true"
      (btnClick)="clicked.emit()"
    ></app-button-base>
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `]
})
export class SettingTriggerComponent {
  clicked = output();
}
