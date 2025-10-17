import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, TranslateModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {
  constructor(private languageService: LanguageService) {}

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}