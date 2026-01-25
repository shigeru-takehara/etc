import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabeledIconComponent } from '../../base/labeled-icon.component';

@Component({
  selector: 'app-setting-trigger',
  standalone: true,
  imports: [CommonModule, LabeledIconComponent],
  template: `
    <app-labeled-icon
      [iconName]="'settings'"
      [label]="'Configure Provider'"
      [tooltip]="'Configure AI Provider and Models'"
      [variant]="'ghost'"
      [fullWidth]="true"
      [clickable]="true"
      (btnClick)="clicked.emit()"
    ></app-labeled-icon>
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `]
})
export class SettingTriggerComponent {
  clicked = output();
}
