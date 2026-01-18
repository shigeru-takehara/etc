import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBubbleBaseComponent } from '../base/chat-bubble-base.component';
import { CHAT_ROLES } from '../../models/chat.model';

@Component({
  selector: 'app-user-bubble',
  standalone: true,
  imports: [CommonModule, ChatBubbleBaseComponent],
  template: `
    <app-chat-bubble-base
      [role]="CHAT_ROLES.USER"
      iconName="user"
      label="You"
      [content]="content()"
    ></app-chat-bubble-base>
  `
})
export class UserBubbleComponent {
  CHAT_ROLES = CHAT_ROLES;
  content = input.required<string>();
}
