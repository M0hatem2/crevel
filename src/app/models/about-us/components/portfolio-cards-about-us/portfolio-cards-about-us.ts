import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PortfolioService } from '../../../../features/portfolio-cards-home/services/PortfolioCardsHome.service';
import { LanguageService, Language } from '../../../../core/services/language.service';
import { LoadingSpinner } from "../../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-portfolio-cards-about-us',
  templateUrl: './portfolio-cards-about-us.html',
  styleUrls: ['./portfolio-cards-about-us.scss'],
  imports: [CommonModule, RouterModule, LoadingSpinner],
})
export class PortfolioCardsAboutUsComponent implements OnInit {
  @ViewChild('scrollableContainer', { static: false }) scrollableContainer!: ElementRef;

  constructor(private por: PortfolioService, private router: Router, private languageService: LanguageService) {}

  cards: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentLanguage: Language = 'en';

  getScrollContainer(): HTMLElement | null {
    return this.scrollableContainer?.nativeElement || null;
  }

  ngOnInit(): void {
    this.loadPortfolio();
    this.currentLanguage = this.languageService.currentLanguage;
    this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  loadPortfolio(): void {
    this.loading = true;
    this.error = null;
    this.por.getPortfolio().subscribe({
      next: (response) => {
        if (response && response.data) {
          // Handle both array format (for home page) and single object format (for detail page)
          if (Array.isArray(response.data)) {
            this.cards = response.data.map((item: any) => ({
              id: item._id || item.id,
              title_en: item.title_en,
              title_ar: item.title_ar,
              image: item.image?.secure_url,
              description_en: item.description_en,
              description_ar: item.description_ar,
              category: item.category,
              category_en: item.category_en,
              category_ar: item.category_ar,
            }));
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // Handle nested data format
            this.cards = response.data.data.map((item: any) => ({
              id: item._id || item.id,
              title_en: item.title_en,
              title_ar: item.title_ar,
              image: item.image?.secure_url,
              description_en: item.description_en,
              description_ar: item.description_ar,
              category: item.category,
              category_en: item.category_en,
              category_ar: item.category_ar,
            }));
          } else {
            this.error = 'Invalid data format received from API';
            this.loading = false;
            return;
          }

          // فلترة الكروت لتظهر كروت Marketing فقط
          this.cards = this.cards.filter(card =>
            card.category?.toLowerCase() === 'software'
          );

          this.loading = false;
          console.log('About Us Marketing Cards:', this.cards);
        } else {
          this.error = 'Invalid data format received from API';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Error fetching portfolio: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Error fetching portfolio:', err);
      },
    });
  }

  viewPortfolioDetails(id: string): void {
    if (id) {
      this.router.navigate(['/portfolio/', id]);
    }
  }

  getCurrentCategory(card: any): string {
    return this.currentLanguage == 'ar' ? (card.category_ar || card.category) : (card.category_en || card.category);
  }

  getCurrentTitle(card: any): string {
    if (this.currentLanguage === 'ar') {
      return card.title_ar || card.title_en || '';
    }
    return card.title_en || card.title_ar || '';
  }

  getCurrentDescription(card: any): string {
    if (this.currentLanguage === 'ar') {
      return card.description_ar || card.description_en || '';
    }
    return card.description_en || card.description_ar || '';
  }

  scrollLeft(): void {
    const container = this.getScrollContainer();
    if (container) {
      const scrollAmount = 320; // Width of one card + gap
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    const container = this.getScrollContainer();
    if (container) {
      const scrollAmount = 320; // Width of one card + gap
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}