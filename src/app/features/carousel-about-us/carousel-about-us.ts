import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsService, AboutUsData } from '../../models/about-us/services/about-us.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-carousel-about-us',
  imports: [CommonModule],
  templateUrl: './carousel-about-us.html',
  styleUrl: './carousel-about-us.scss'
})
export class CarouselAboutUs implements OnInit, OnDestroy {
  aboutData: AboutUsData | null = null;
  scrollingImages: string[] = [];
  currentIndex: number = 0;
  autoScrollInterval: any;

  constructor(
    private aboutUsService: AboutUsService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAboutUsData();

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(() => {
      this.loadAboutUsData();
    });
  }

  ngOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  private loadAboutUsData(): void {
    this.aboutUsService.getAboutUsData().subscribe({
      next: (response) => {
        this.aboutData = response.aboutUs;
        this.scrollingImages = response.aboutUs?.scrollingImages?.map((img: any) => img.secure_url) || [];
        this.startAutoScroll();
      },
      error: (error) => {
        console.error('Error loading about us data:', error);
        this.scrollingImages = [];
      }
    });
  }

  private startAutoScroll(): void {
    if (this.scrollingImages.length <= 1) return;

    // Clear existing interval
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }

    // Start auto-scroll every 4 seconds
    this.autoScrollInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide(): void {
    if (this.scrollingImages.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.scrollingImages.length;
    }
  }

  prevSlide(): void {
    if (this.scrollingImages.length > 0) {
      this.currentIndex = this.currentIndex === 0
        ? this.scrollingImages.length - 1
        : this.currentIndex - 1;
    }
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.scrollingImages.length) {
      this.currentIndex = index;
    }
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
