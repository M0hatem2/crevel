import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$: Observable<Language> = this.currentLanguageSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Load language from localStorage on service initialization
    const savedLanguage = localStorage.getItem('lang') as Language;
    const browserLang = (translate.getBrowserLang() as string)?.split('-')[0] as Language;

    // Determine initial language: saved preference > browser language > default (en)
    let initialLang: Language = 'en';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      initialLang = savedLanguage;
    } else if (browserLang && (browserLang === 'en' || browserLang === 'ar')) {
      initialLang = browserLang;
    }

    console.log('LanguageService initializing with language:', initialLang);

    // Set initial language without triggering another localStorage save
    this.currentLanguageSubject.next(initialLang);
    localStorage.setItem('lang', initialLang);

    // Use translate service
    this.translate.use(initialLang).subscribe({
      next: () => {
        console.log(`Successfully loaded ${initialLang} translations`);
        this.updateDocumentDirection(initialLang);
      },
      error: (error) => {
        console.error(`Error loading ${initialLang} translations:`, error);
        // Fallback to English
        this.translate.use('en').subscribe({
          next: () => {
            console.log('Fallback to English translations loaded successfully');
            this.updateDocumentDirection('en');
          },
          error: (err) => {
            console.error('Fallback to English also failed:', err);
          }
        });
      }
    });
  }

  get currentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    if (language === 'en' || language === 'ar') {
      // Only update if the language is actually different
      if (this.currentLanguageSubject.value !== language) {
        console.log(`LanguageService: Changing language from ${this.currentLanguageSubject.value} to ${language}`);
        this.currentLanguageSubject.next(language);
        localStorage.setItem('lang', language);

        this.translate.use(language).subscribe({
          next: () => {
            console.log(`LanguageService: Successfully loaded ${language} translations`);
            this.updateDocumentDirection(language);
          },
          error: (error) => {
            console.error(`LanguageService: Error loading ${language} translations:`, error);
          }
        });
      } else {
        console.log(`LanguageService: Language is already ${language}, no change needed`);
      }
    }
  }

  toggleLanguage(): void {
    const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.setLanguage(newLanguage);
  }

  private updateDocumentDirection(language: Language): void {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);

    // Apply direction to body element as well for better support
    document.body.setAttribute('dir', direction);

    // Add/remove RTL class for easier CSS targeting
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  // Helper method to get translated text using ngx-translate
  getTranslation(key: string): Observable<string> {
    return this.translate.get(key);
  }

  // Synchronous translation method
  getTranslationSync(key: string): string {
    return this.translate.instant(key);
  }
}
