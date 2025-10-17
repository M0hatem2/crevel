import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { SocialMediaCardsService, PortfolioItem } from './service/social-media-cards.service';
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

@Component({
  selector: 'app-social-media-cards',
  imports: [CommonModule, TranslateModule, LoadingSpinner],
  templateUrl: './social-media-cards.html',
  styleUrl: './social-media-cards.scss',
})
export class SocialMediaCards implements OnInit {
  portfolioItems: PortfolioItem[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private socialMediaCardsService: SocialMediaCardsService, private router: Router, private translate: TranslateService, private languageService: LanguageService) {}

  get currentLanguage(): string {
    return this.languageService.currentLanguage;
  }

  ngOnInit(): void {
    this.getPortfolio();
  }

  getPortfolio() {
    this.isLoading = true;
    this.error = null;

    this.socialMediaCardsService.getPortfolio( ).subscribe({
      next: (res) => {
        this.portfolioItems = res.data.data;
        this.isLoading = false;
        console.log('Portfolio items:', this.portfolioItems);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.languageService.getTranslationSync('ERRORS.LOAD_FAILED') || 'Failed to load portfolio items. Please try again.';
        console.error('Error fetching portfolio:', err);
      },
    });
  }

  getCurrentTitle(item: PortfolioItem): string {
    return  item.title_en;
  }

  getCurrentDescription(item: PortfolioItem): string {
    return item.description_en;
  }

  trackByFn(index: number, item: PortfolioItem): string {
    return item._id || item.id || index.toString();
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  onCardClick(item: PortfolioItem) {
    const itemId = item._id || item.id;
    if (itemId) {
      this.router.navigate(['/portfolio', itemId]);
    }
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }
}
