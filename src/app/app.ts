import { Component, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { FloatingButtonsComponent } from './shared/components/floating-buttons/floating-buttons.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    FontAwesomeModule,
    Footer,
    FloatingButtonsComponent,
    TranslateModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('crevel');

  constructor(
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    // Initialize ngx-translate with default language
    this.translate.setDefaultLang('en');

    // The LanguageService will handle loading the saved language from localStorage
    // and setting up the initial language state

    // Subscribe to language changes from LanguageService
    this.languageService.currentLanguage$.subscribe((lang) => {
      console.log(`Language changed to: ${lang}`);
      // The LanguageService already handles translate.use() and document direction
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // ترجع الصفحة لأعلى
      }
    });
  }

  isAdmin(): boolean {
    return this.router.url.includes('admin');
  }
}
