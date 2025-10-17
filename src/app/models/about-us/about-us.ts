import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContactUs } from '../../features/contact-us/contact-us';
import { AboutUsService, AboutUsData } from './services/about-us.service';
import { LanguageService } from '../../core/services/language.service';
import { PortfolioCardsHomeComponent } from '../../features/portfolio-cards-home/portfolio-cards-home';
import { PortfolioCardsAboutUsComponent } from './components/portfolio-cards-about-us/portfolio-cards-about-us';

// Debug import
console.log('PortfolioCardsHomeComponent imported:', PortfolioCardsHomeComponent);
import { Hr } from '../../shared/components/hr/hr';
import { CarouselAboutUs } from '../../features/carousel-about-us/carousel-about-us';
import { SeeMoreBtn } from '../../shared/components/see-more-btn/see-more-btn';
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, TranslateModule, ContactUs, PortfolioCardsAboutUsComponent, Hr, CarouselAboutUs, SeeMoreBtn, LoadingSpinner],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs implements OnInit, AfterViewInit {
  aboutData: AboutUsData | null = null;
  loading = false;
  title = 'About Us';
  description = '';
  aboutUsImages: string[] = [];
  scrollingImages: string[] = [];
  imageColumns: string[][] = [];
  successMessage = '';
  currentLanguage = 'en'; // Public property to expose current language to template

  // Scroll
  @ViewChild(PortfolioCardsAboutUsComponent) portfolioCardsAboutUs!: PortfolioCardsAboutUsComponent;
  currentScrollPosition = 0;
  maxScrollWidth = 0;
  private autoScrollInterval: any;

  constructor(private aboutUsService: AboutUsService, private languageService: LanguageService) {}

  ngOnInit(): void {
    this.aboutUsService.getAboutUsData().subscribe({
      next: (response) => {
        this.aboutData = response.aboutUs;
        this.successMessage = response.message;
        this.updateDisplayData();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    this.currentLanguage = this.languageService.currentLanguage;
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.updateDisplayData();
    });
  }

  private updateDisplayData(): void {
    if (this.aboutData) {
      const lang = this.languageService.currentLanguage;
      // Use Arabic fields if available, otherwise fall back to English
      this.title =
        lang === 'ar'
          ? this.aboutData.title_ar || this.aboutData.title_en || 'About Us'
          : this.aboutData.title_en || 'About Us';
      this.description =
        lang === 'ar'
          ? this.aboutData.description_ar || this.aboutData.description_en || ''
          : this.aboutData.description_en || '';
      this.aboutUsImages = this.aboutData.aboutUsImages?.map((img) => img.secure_url) || [];
      this.scrollingImages = this.aboutData.scrollingImages?.map((img) => img.secure_url) || [];
      this.chunkImagesForGrid();
    }
  }

  private chunkImagesForGrid(): void {
    // Chunk images into groups of 3 for the grid layout (3 images per column)
    this.imageColumns = [];
    for (let i = 0; i < this.aboutUsImages.length; i += 3) {
      this.imageColumns.push(this.aboutUsImages.slice(i, i + 3));
    }
  }

  ngAfterViewInit(): void {
    // Wait for the portfolio component to be ready, then update scroll properties
    setTimeout(() => {
      console.log('Portfolio component ViewChild:', this.portfolioCardsAboutUs);
      this.updateScrollProperties();
      window.addEventListener('resize', () => this.updateScrollProperties());

      // Auto-scroll بعد 2 ثانية
      setTimeout(() => this.startAutoScroll(), 2000);
    }, 500);
  }

  private updateScrollProperties(): void {
    setTimeout(() => {
      const container = this.portfolioCardsAboutUs?.getScrollContainer();
      if (container) {
        this.maxScrollWidth = container.scrollWidth - container.clientWidth;
        this.currentScrollPosition = container.scrollLeft;
      }
    }, 100);
  }

  scrollLeft(): void {
    console.log('Scroll left called');
    const container = this.portfolioCardsAboutUs?.getScrollContainer();
    console.log('Scroll container:', container);
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
      this.updateScrollPosition();
    } else {
      console.error('Scroll container not found');
    }
  }

  scrollRight(): void {
    console.log('Scroll right called');
    const container = this.portfolioCardsAboutUs?.getScrollContainer();
    console.log('Scroll container:', container);
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
      this.updateScrollPosition();
    } else {
      console.error('Scroll container not found');
    }
  }

  private updateScrollPosition(): void {
    setTimeout(() => {
      const container = this.portfolioCardsAboutUs?.getScrollContainer();
      if (container) {
        this.currentScrollPosition = container.scrollLeft;
      }
    }, 300);
  }

  startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (this.currentScrollPosition >= this.maxScrollWidth) {
        this.currentScrollPosition = 0;
        const container = this.portfolioCardsAboutUs?.getScrollContainer();
        if (container) {
          container.scrollLeft = 0;
        }
      } else {
        this.scrollRight();
      }
    }, 3000);
  }

  stopAutoScroll(): void {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
