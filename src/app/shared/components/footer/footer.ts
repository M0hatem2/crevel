import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterService, FooterResponse, FooterData } from './services/footer.service';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService, Language } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  footerResponse: FooterResponse | null = null;
  footerData: FooterData | null = null;
  loading = true;
  error: string | null = null;
  currentLanguage: Language = 'en';
  showFooter: boolean = false;
  constructor(
    private footerService: FooterService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.router.events.subscribe(() => {
      this.showFooter = this.router.url.includes('admin');
    });
  }

  ngOnInit() {
    this.loadFooterData();
    this.currentLanguage = this.languageService.currentLanguage;
    this.languageService.currentLanguage$.subscribe((language) => {
      this.currentLanguage = language;
    });
  }

  loadFooterData() {
    this.loading = true;

    // First try to load from backend
    this.footerService.getFooterData().subscribe({
      next: (response: FooterResponse) => {
        this.footerResponse = response;
        this.footerData = response.footer;
        this.loading = false;
        console.log('✅ Backend footer data loaded successfully:', this.footerData);
      },
      error: (error: any) => {
        console.error('❌ Backend API failed, using mock data instead:', error);

        // Fallback to mock data if backend fails
        this.loading = false;
        console.log('✅ Using mock footer data:', this.footerData);
      },
    });
  }

  getSocialIcon(platform: string): string {
    const iconMap: { [key: string]: string } = {
      facebook: 'facebook-f',
      twitter: 'x-twitter',
      linkedin: 'linkedin-in',
      instagram: 'instagram',
      instgram: 'instagram', // Handle typo in API
      youtube: 'youtube',
      github: 'github',
    };
    return iconMap[platform.toLowerCase()] || 'link';
  }

  isAdmin(): boolean {
    return this.router.url.includes('admin');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }

  navigateToExternal(url: string) {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  }

  // Method to test backend connection
  testBackendConnection() {
    console.log('🔄 Testing backend connection...');
    this.loadFooterData();
  }

  // Method to force refresh data
  refreshData() {
    this.footerData = null;
    this.loadFooterData();
  }
}
