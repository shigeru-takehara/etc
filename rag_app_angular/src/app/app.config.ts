import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import {
  LucideAngularModule,
  User, Bot, X, Settings, Database, Cloud, Plus, Trash2,
  Layers, Search, Cpu, FolderOpen, ChevronDown, Check,
  FileText, Send, Loader2, MessageSquare, ShieldCheck
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      LucideAngularModule.pick({
        User, Bot, X, Settings, Database, Cloud, Plus, Trash2,
        Layers, Search, Cpu, FolderOpen, ChevronDown, Check,
        FileText, Send, Loader2, MessageSquare, ShieldCheck
      })
    )
  ]
};
