import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService, Language } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  standalone: true,
  imports: [TranslateModule],
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLang: Language = 'en';
  private subscription: Subscription = new Subscription();

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    // Get current language from LanguageService
    this.currentLang = this.languageService.currentLanguage;

    // Subscribe to language changes from LanguageService
    this.subscription.add(
      this.languageService.currentLanguage$.subscribe((lang: Language) => {
        this.currentLang = lang;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  switchLang(lang: string) {
    this.languageService.setLanguage(lang as Language);
  }
}
