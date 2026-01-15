// Main Application Component
import { Component, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SidebarComponent } from './components/sidebar.component';
import { SettingDialogComponent } from './components/sidebar/setting/setting-dialog.component';
import { UserBubbleComponent } from './components/chat/user-bubble.component';
import { AssistantBubbleComponent } from './components/chat/assistant-bubble.component';
import { ChatInputComponent } from './components/chat/chat-input.component';
import { ProcessingOverlayComponent } from './components/main/processing-overlay.component';
import { WelcomeHeaderComponent } from './components/main/welcome-header.component';
import { RagService } from './services/rag.service';
import { CHAT_ROLES } from './models/chat.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    SidebarComponent,
    SettingDialogComponent,
    UserBubbleComponent,
    AssistantBubbleComponent,
    ChatInputComponent,
    ProcessingOverlayComponent,
    WelcomeHeaderComponent
  ],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <app-sidebar class="sidebar" (openSettings)="isSettingsOpen.set(true)"></app-sidebar>

      <!-- Main Chat Area -->
      <main class="main-chat">
        
        <!-- Processing Overlay -->
        <app-processing-overlay 
          [isVisible]="isProcessing()" 
          [statusText]="processingStatus()"
        ></app-processing-overlay>

        <!-- Scrollable Messages -->
        <div #scrollContainer class="messages-area custom-scrollbar">
          <div class="chat-container">
            
            <!-- Welcome Header -->
            <app-welcome-header *ngIf="messages().length === 0"></app-welcome-header>

            <!-- Messages -->
            @for (msg of messages(); track $index) {
              <app-user-bubble *ngIf="msg.role === CHAT_ROLES.USER" [content]="msg.content"></app-user-bubble>
              <app-assistant-bubble *ngIf="msg.role === CHAT_ROLES.ASSISTANT" [content]="msg.content"></app-assistant-bubble>
            }
          </div>
        </div>

        <!-- Input Area -->
        <app-chat-input 
          [(userInput)]="userInput" 
          [isProcessing]="isProcessing()" 
          [rewriteStatus]="rewriteStatus()"
          (submit)="handleSubmit()"
        ></app-chat-input>
      </main>

      <app-setting-dialog 
        [isOpen]="isSettingsOpen()" 
        (close)="isSettingsOpen.set(false)"
      ></app-setting-dialog>
    </div>
  `
})
export class App implements AfterViewChecked {
  private ragService = inject(RagService);
  CHAT_ROLES = CHAT_ROLES;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isSettingsOpen = signal(false);
  userInput = '';
  rewriteStatus = signal<string | null>(null);

  messages = this.ragService.messages;
  isProcessing = this.ragService.isProcessing;
  processingStatus = this.ragService.processingStatus;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  async handleSubmit() {
    if (!this.userInput.trim() || this.isProcessing()) return;

    // Smart Search Logic
    if (this.ragService.isQueryRewritingEnabled() && !this.rewriteStatus()) {
      this.isProcessing.set(true);
      this.rewriteStatus.set("Optimizing query...");

      try {
        const rewritten = await this.ragService.rewriteQuery(this.userInput);
        this.userInput = rewritten;
        this.rewriteStatus.set("Query optimized. Press Enter to search.");
      } catch (err) {
        this.rewriteStatus.set(null); // Fallback if fails
      } finally {
        this.isProcessing.set(false);
      }
      return; // Stop here, wait for user confirmation
    }

    // Normal submission (or confirmation after rewrite)
    const query = this.userInput;
    this.userInput = '';
    this.rewriteStatus.set(null); // Reset status
    await this.ragService.askQuestion(query);
  }
}
