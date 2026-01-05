import { Component, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SidebarComponent } from './components/sidebar.component';
import { SettingsDialogComponent } from './components/settings-dialog.component';
import { ChatBubbleComponent } from './components/chat-bubble.component';
import { RagService } from './services/rag.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    SidebarComponent,
    SettingsDialogComponent,
    ChatBubbleComponent
  ],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <app-sidebar class="sidebar" (openSettings)="isSettingsOpen.set(true)"></app-sidebar>

      <!-- Main Chat Area -->
      <main class="main-chat">
        
        <!-- Processing Overlay -->
        <div *ngIf="isProcessing()" class="absolute top-0 left-0 right-0 z-40">
          <div class="h-1 bg-slate-800 overflow-hidden">
            <div class="h-full bg-primary-500 animate-progress w-1/3"></div>
          </div>
          <div class="bg-primary-500/10 backdrop-blur-md px-6 py-2 flex items-center justify-between border-b border-primary-500/20">
            <div class="flex items-center gap-3">
              <lucide-icon [name]="'loader-2'" class="animate-spin text-primary-400" [size]="14"></lucide-icon>
              <span class="text-xs font-semibold text-primary-300 uppercase tracking-widest">Processing Intelligence...</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Messages -->
        <div #scrollContainer class="messages-area custom-scrollbar">
          <div class="chat-container">
            
            <!-- Welcome Header -->
            <div *ngIf="messages().length === 0" class="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div class="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <lucide-icon [name]="'message-square'" [size]="48" class="text-primary-500 relative"></lucide-icon>
              </div>
              <div class="space-y-2">
                <h2 class="text-3xl font-bold text-white tracking-tight">AI Knowledge Assistant</h2>
                <p class="text-slate-400 max-w-md mx-auto leading-relaxed">
                  Upload documents to create your local knowledge base. Search and reason over your data securely.
                </p>
              </div>
              <div class="flex items-center gap-6 pt-4">
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <lucide-icon [name]="'shield-check'" [size]="14"></lucide-icon> 100% Local Privacy
                </div>
                <div class="w-1 h-1 bg-slate-800 rounded-full"></div>
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                  High Performance
                </div>
              </div>
            </div>

            <!-- Messages -->
            @for (msg of messages(); track $index) {
              <app-chat-bubble [message]="msg"></app-chat-bubble>
            }
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-wrapper">
          <div class="input-container">
            <input 
              type="text" 
              [(ngModel)]="userInput"
              name="userInput"
              placeholder="Ask your documents anything..." 
              class="chat-input"
              [disabled]="isProcessing()"
              (keyup.enter)="handleSubmit($event)"
            />
            <button 
              type="button"
              (click)="handleSubmit($event)"
              [disabled]="!userInput.trim() || isProcessing()"
              class="btn-primary"
              style="padding: 0.5rem 1rem; margin-right: 0.5rem;"
            >
              <lucide-icon *ngIf="!isProcessing()" [name]="'send'" [size]="20"></lucide-icon>
              <lucide-icon *ngIf="isProcessing()" [name]="'loader-2'" class="animate-spin" [size]="20"></lucide-icon>
            </button>
          </div>
          <p class="text-center mt-2 text-[10px] uppercase tracking-[0.2em] font-medium" 
             [ngClass]="rewriteStatus() ? 'text-primary-400 animate-pulse' : 'text-slate-500'">
            {{ rewriteStatus() || 'Powered by Local Intelligence' }}
          </p>
        </div>
      </main>

      <app-settings-dialog 
        [isOpen]="isSettingsOpen()" 
        (close)="isSettingsOpen.set(false)"
      ></app-settings-dialog>
    </div>
  `
})
export class App implements AfterViewChecked {
  private ragService = inject(RagService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isSettingsOpen = signal(false);
  userInput = '';
  rewriteStatus = signal<string | null>(null);

  messages = this.ragService.messages;
  isProcessing = this.ragService.isProcessing;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
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
