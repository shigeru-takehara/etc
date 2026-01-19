import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideMarkdown } from 'ngx-markdown';
import {
  LucideAngularModule,
  User, Bot, X, Settings, Database, Cloud, Plus, Trash2,
  Layers, Search, Cpu, FolderOpen, ChevronDown, Check,
  FileText, Send, Loader2, MessageSquare, ShieldCheck,
  CheckCircle, Play,
  Copy, AlertCircle, Activity, Sparkles, Target
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideMarkdown(),
    importProvidersFrom(
      LucideAngularModule.pick({
        User, Bot, X, Settings, Database, Cloud, Plus, Trash2,
        Layers, Search, Cpu, FolderOpen, ChevronDown, Check,
        FileText, Send, Loader2, MessageSquare, ShieldCheck, CheckCircle, Play, Copy, AlertCircle, Activity, Sparkles, Target
      })
    )
  ]
};
