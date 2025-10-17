import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-trusted-services',
  imports: [TranslateModule],
  templateUrl: './trusted-services.html',
  styleUrl: './trusted-services.scss'
})
export class TrustedServices {
  constructor(private languageService: LanguageService) {}

  get currentLanguage(): string {
    return this.languageService.currentLanguage;
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
