import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PortfolioService } from './services/PortfolioCardsHome.service';
import { LanguageService, Language } from '../../core/services/language.service';
import { SeeMoreBtn } from '../../shared/components/see-more-btn/see-more-btn';
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-portfolio-cards-home',
  templateUrl: './portfolio-cards-home.html',
  styleUrls: ['./portfolio-cards-home.scss'],
  imports: [CommonModule, RouterModule, SeeMoreBtn, TranslateModule, LoadingSpinner],
})
export class PortfolioCardsHomeComponent implements OnInit {
  @ViewChild('scrollableContainer', { static: false }) scrollableContainer!: ElementRef;
  @Input() category: string = '';
  currentLanguage: Language = 'en';

  constructor(
    private por: PortfolioService,
    private router: Router,
    private languageService: LanguageService
  ) {}

  portfolioItems: any[] = [];
  cards: any[] = [];
  filteredCards: any[] = [];
  loading: boolean = true;
  error: string | null = null;

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

    // Load translations for current language
    this.currentLanguage = this.languageService.currentLanguage;

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
            }));
          } else {
            this.error = 'Invalid data format received from API';
            this.loading = false;
            return;
          }
          this.loading = false;
          this.filterCards();
          this.portfolioItems = this.filteredCards; // Show all items
          console.log(this.cards);
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

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  private filterCards(): void {
    if (this.category && this.category.trim()) {
      this.filteredCards = this.cards.filter(card =>
        card.category?.toLowerCase() === this.category.toLowerCase()
      );
    } else {
      this.filteredCards = this.cards;
    }
  }

  // Methods for template compatibility
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  onCardClick(item: any): void {
    this.viewPortfolioDetails(item.id);
  }

  getCurrentTitle(item: any): string {
    if (this.currentLanguage === 'ar') {
      return item.title_ar || item.title_en || '';
    }
    return item.title_en || item.title_ar || '';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getCurrentDescription(item: any): string {
    if (this.currentLanguage === 'ar') {
      return item.description_ar || item.description_en || '';
    }
    return item.description_en || item.description_ar || '';
  }
}
