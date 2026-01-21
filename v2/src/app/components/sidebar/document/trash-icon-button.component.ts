/**
 * Specialized Trash Icon Button for Deletion
 * 
 * Usage:
 * <app-trash-icon-button (click)="onDelete()"></app-trash-icon-button>
 * 
 * Outputs:
 * - click: MouseEvent - emitted when the delete button is clicked
 */
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonBaseComponent } from '../../base/icon-button-base.component';

@Component({
    selector: 'app-trash-icon-button',
    standalone: true,
    imports: [CommonModule, IconButtonBaseComponent],
    template: `
    <app-icon-button-base 
      [iconName]="'trash-2'" 
      [size]="16"
      [tooltip]="'Delete Document'"
      (btnClick)="click.emit($event)"
      class="trash-btn"
    ></app-icon-button-base>
  `,
    styles: [`
    .trash-btn :host ::ng-deep .icon-button:hover {
      color: #ef4444; /* red-500 */
      background: rgba(239, 68, 68, 0.1);
    }
  `]
})
export class TrashIconButtonComponent {
    click = output<MouseEvent>();
}
