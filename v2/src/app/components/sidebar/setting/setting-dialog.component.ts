import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RagService } from '../../../services/rag.service';
import { TabsBaseComponent } from '../../base/tabs-base.component';
import { TabBaseComponent } from '../../base/tab-base.component';
import { LocalSettingFormComponent } from './local-setting-form.component';
import { CloudSettingFormComponent } from './cloud-setting-form.component';
import { AdvancedSettingForm } from './advanced-setting-form.component';

@Component({
  selector: 'app-setting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    TabsBaseComponent,
    TabBaseComponent,
    LocalSettingFormComponent,
    CloudSettingFormComponent,
    AdvancedSettingForm
  ],
  template: `
    <div *ngIf="isOpen()" class="modal-overlay">
      <div class="modal-content animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="sidebar-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <lucide-icon [name]="'settings'" class="text-primary-400" [size]="20"></lucide-icon>
            <h2 class="text-xl font-semibold text-white">Settings</h2>
          </div>
          <button (click)="close.emit()" style="padding: 0.5rem; border-radius: 9999px; background: transparent; border: none; color: #475569; cursor: pointer; transition: color 0.2s;">
            <lucide-icon [name]="'x'" [size]="20" class="hover:text-white"></lucide-icon>
          </button>
        </div>

        <!-- Declarative Tabs -->
        <div style="flex: 1; min-height: 25rem;">
          <app-tabs-base [(activeId)]="activeTab">
            <app-tab-base id="local" label="Local" icon="database">
               <div style="padding: 0 1.5rem 1.5rem;">
                  <app-local-setting-form [config]="tempLocal"></app-local-setting-form>
               </div>
            </app-tab-base>
            
            <app-tab-base id="cloud" label="Cloud" icon="cloud">
               <div style="padding: 0 1.5rem 1.5rem;">
                  <app-cloud-setting-form [config]="tempCloud"></app-cloud-setting-form>
               </div>
            </app-tab-base>

            <app-tab-base id="advanced" label="Advanced" icon="cpu">
               <div style="padding: 0 1.5rem 1.5rem;">
                  <app-advanced-setting-form></app-advanced-setting-form>
               </div>
            </app-tab-base>
          </app-tabs-base>
        </div>

        <!-- Footer -->
        <div class="sidebar-footer" style="display: flex; justify-content: flex-end; gap: 1rem; padding: 1.25rem 1.5rem; background: rgba(2, 6, 23, 0.3);">
          <button (click)="close.emit()" class="btn-cancel">Cancel</button>
          <button (click)="handleSave()" class="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 1.25rem;
      width: 100%;
      max-width: 32rem;
      height: 40rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }
    .btn-cancel {
      padding: 0.625rem 1.5rem;
      background: transparent;
      border: 1px solid #1e293b;
      border-radius: 0.75rem;
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover {
      background: #1e293b;
      color: white;
    }
    .btn-save {
      padding: 0.625rem 1.5rem;
      background: #2563eb;
      border: none;
      border-radius: 0.75rem;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-save:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
  `]
})
export class SettingDialogComponent {
  private ragService = inject(RagService);

  isOpen = input.required<boolean>();
  close = output();

  activeTab = signal<string>('local');

  tempLocal = { ...this.ragService.localConfig() };
  tempCloud = { ...this.ragService.cloudConfig() };

  handleSave() {
    this.ragService.updateConfig('local', this.tempLocal);
    this.ragService.updateConfig('cloud', this.tempCloud);
    this.close.emit();
  }
}
