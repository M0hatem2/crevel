import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Header } from '../../features/header/header';
import { WhoWeAre } from '../../features/who-we-are/who-we-are';
import { OurServices } from '../../features/our-services/our-services';
import { HowWeSucceed } from '../../features/how-we-succeed/how-we-succeed';
import { ContactUs } from '../../features/contact-us/contact-us';
import { Hr } from '../../shared/components/hr/hr';
import { PortfolioCardsHomeComponent } from '../../features/portfolio-cards-home/portfolio-cards-home';
import { OurBlueprint } from '../../features/our-blueprint/our-blueprint';
import { SeeMoreBtn } from '../../shared/components/see-more-btn/see-more-btn';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslateModule,
    Header,
    WhoWeAre,
    OurServices,
    HowWeSucceed,
    OurBlueprint,
    ContactUs,
    Hr,
    PortfolioCardsHomeComponent,
    SeeMoreBtn,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  @ViewChild(PortfolioCardsHomeComponent, { static: false })
  portfolioCardsComponent!: PortfolioCardsHomeComponent;

  // Modal properties
  showModal = false;
  modalLoading = false;
  error: string | null = null;
  selectedServiceData: any = null;
  currentLanguage = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.currentLanguage;

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  scrollLeft(): void {
    const scrollContainer = this.portfolioCardsComponent?.getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: -320, // Scroll left by card width (320px for w-80)
        behavior: 'smooth',
      });
    }
  }

  scrollRight(): void {
    const scrollContainer = this.portfolioCardsComponent?.getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: 320, // Scroll right by card width (320px for w-80)
        behavior: 'smooth',
      });
    }
  }

  // Modal methods
  openModal(service: any): void {
    this.selectedServiceData = service;
    this.showModal = true;
    this.modalLoading = false;
    this.error = null;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedServiceData = null;
    this.modalLoading = false;
    this.error = null;
  }

  getServiceIcon(iconClass: string): string {
    return iconClass || 'fa-solid fa-gear';
  }

  onServiceCardClick(service: any): void {
    this.openModal(service);
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
