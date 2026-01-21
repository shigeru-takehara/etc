/**
 * Specialized Close Icon Button for Dialogs
 * 
 * Usage:
 * <app-close-icon-button (click)="onClose()"></app-close-icon-button>
 * 
 * Outputs:
 * - click: MouseEvent - emitted when the close button is clicked
 */
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonBaseComponent } from '../../base/icon-button-base.component';

@Component({
    selector: 'app-close-icon-button',
    standalone: true,
    imports: [CommonModule, IconButtonBaseComponent],
    template: `
    <app-icon-button-base 
      [iconName]="'x'" 
      [size]="20"
      [tooltip]="'Close'"
      (btnClick)="click.emit($event)"
      class="close-btn"
    ></app-icon-button-base>
  `,
    styles: [`
    .close-btn :host ::ng-deep .icon-button {
      border-radius: 9999px;
      color: #475569;
    }
    
    .close-btn :host ::ng-deep .icon-button:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class CloseIconButtonComponent {
    click = output<MouseEvent>();
}
