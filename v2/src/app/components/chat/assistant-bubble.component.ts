import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBubbleBaseComponent } from '../base/chat-bubble-base.component';
import { CHAT_ROLES } from '../../models/chat.model';

@Component({
    selector: 'app-assistant-bubble',
    standalone: true,
    imports: [CommonModule, ChatBubbleBaseComponent],
    template: `
    <app-chat-bubble-base
      [role]="CHAT_ROLES.ASSISTANT"
      iconName="bot"
      label="Assistant"
      [content]="content()"
    ></app-chat-bubble-base>
  `
})
export class AssistantBubbleComponent {
    CHAT_ROLES = CHAT_ROLES;
    content = input.required<string>();
}
