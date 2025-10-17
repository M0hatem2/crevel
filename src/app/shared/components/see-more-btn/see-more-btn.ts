import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-see-more-btn',
  imports: [RouterLink],
  templateUrl: './see-more-btn.html',
  styleUrl: './see-more-btn.scss'
})
export class SeeMoreBtn {
  @Input() link: string = '/portfolio';
  @Input() text: string = '';
  @Input() translationKey?: string;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  get currentLanguage(): string {
    return this.languageService.currentLanguage;
  }

  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }

  getDisplayText(): string {
    if (this.translationKey) {
      return this.getTranslation(this.translationKey) || this.getTranslation('COMPONENTS.BUTTONS.SEE_MORE') || this.text;
    }
    return this.getTranslation('COMPONENTS.BUTTONS.SEE_MORE') || this.text;
  }
}
