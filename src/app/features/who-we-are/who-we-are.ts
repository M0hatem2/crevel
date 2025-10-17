import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService, Language } from '../../core/services/language.service';

@Component({
  selector: 'app-who-we-are',
  imports: [CommonModule, TranslateModule],
  templateUrl: './who-we-are.html',
  styleUrl: './who-we-are.scss'
})
export class WhoWeAre {
  currentLanguage: Language = 'en';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.languageService.currentLanguage;
    this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }
}
