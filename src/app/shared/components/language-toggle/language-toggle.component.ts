import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss']
})
export class LanguageToggleComponent {
  constructor(public languageService: LanguageService) {}

  toggleLanguageAndRefresh(): void {
    this.languageService.toggleLanguage();
    // Refresh the page to apply language changes
    window.location.reload();
  }

  getLanguageIcon(): string {
    return this.languageService.currentLanguage === 'ar' ? '🇸🇦' : '🇺🇸';
  }

  getLanguageText(): string {
    return this.languageService.getTranslationSync(
      this.languageService.currentLanguage === 'ar' ? 'LANGUAGES.ARABIC' : 'LANGUAGES.ENGLISH'
    );
  }

  getLanguageIconClass(): string {
    return this.languageService.currentLanguage === 'ar' ? 'fas fa-language text-lg' : 'fas fa-globe text-lg';
  }
}
