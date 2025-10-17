import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Router } from '@angular/router';

import { ContactUs } from '../../features/contact-us/contact-us';
import { PortfolioCardsComponent } from '../../features/portfolio-cards/portfolio-cards';
import { PortfolioService } from './services/PortfolioCards.service';
import { SocialMediaCards } from '../../shared/components/social-media-cards/social-media-cards';
import { LanguageService } from '../../core/services/language.service';
// Removed PortfolioCardsComponent import to resolve circular dependency
// src/app/models/portfolio.model.ts
export interface Image {
  public_id: string;
  secure_url: string;
}

export interface User {
  fullName: string;
  profilePic: string;
  email: string;
  role: string;
}

export interface PortfolioItem {
  _id?: string;
  id?: string;
  title_en: string;
  title_ar?: string;
  description_en: string;
  description_ar?: string;
  githubRepo?: string;
  productionUrl?: string;
  category?: string;
  category_en?: string;
  category_ar?: string;
  image?: Image;
  gallery?: Image[];
  addedBy?: User;
  updatedBy?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioResponse {
  status: string;
  data: PortfolioItem[];
  message?: string;
  seeMore?: boolean;
}

@Component({
  selector: 'app-portfolio',
  imports: [
    CommonModule,
    TranslateModule,
    ContactUs,
    PortfolioCardsComponent,
    SocialMediaCards,
  ],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss'],
})
export class Portfolio implements OnInit {
  portfolio: PortfolioItem[] = [];
  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  error: string | null = null;
  showLanguageToggle: boolean = false;
  selectedLanguage: 'en' | 'ar' = 'en';
  showSeeMore: boolean = false;
  expandedDescriptions: Set<string> = new Set(); // Track expanded descriptions by item ID

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Read language from localStorage
    const savedLang = localStorage.getItem('lang') as 'en' | 'ar';
    this.selectedLanguage = savedLang || 'en';
    this.getPortfolio();
  }

  getPortfolio() {
    this.isLoading = true;
    this.error = null;
    this.portfolioService.getPortfolio().subscribe({
      next: (res) => {
        this.portfolio = res.data.data;
        this.showSeeMore = res.data.seeMore;
        this.isLoading = false; // Set loading to false when data is loaded
        console.log('Portfolio items:', this.portfolio);
      },
      error: (err) => {
        this.isLoading = false; // Set loading to false on error
        this.error = this.languageService.getTranslationSync('ERRORS.LOAD_FAILED') || 'Failed to load portfolio items. Please try again.';
        console.error('Error fetching portfolio:', err);
      },
    });
  }

  retryLoad() {
    this.getPortfolio();
  }

  loadMore() {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;
    // Implement pagination logic here
    // For now, just simulate loading more data
    setTimeout(() => {
      this.isLoadingMore = false;
    }, 1000);
  }

  switchLanguage(lang: 'en' | 'ar') {
    this.selectedLanguage = lang;
  }

  getCurrentTitle(item: PortfolioItem): string {
    return this.selectedLanguage === 'en' ? item.title_en : item.title_ar || item.title_en;
  }

  getCurrentDescription(item: PortfolioItem): string {
    return this.selectedLanguage === 'en'
      ? item.description_en
      : item.description_ar || item.description_en;
  }

  openPortfolioDetail(item: PortfolioItem) {
    // Navigate to portfolio detail page with the item ID
    this.router.navigate(['/portfolio', item._id]);
  }

  onImageError(event: any) {
    // Handle image loading errors
    event.target.style.display = 'none';
  }

  toggleDescription(item: PortfolioItem) {
    const itemId = item._id || item.id;
    if (itemId && this.expandedDescriptions.has(itemId)) {
      this.expandedDescriptions.delete(itemId);
    } else if (itemId) {
      this.expandedDescriptions.add(itemId);
    }
  }

  isDescriptionExpanded(item: PortfolioItem): boolean {
    const itemId = item._id || item.id;
    return itemId ? this.expandedDescriptions.has(itemId) : false;
  }

  getGalleryLength(item: PortfolioItem): number {
    return item?.gallery?.length || 0;
  }

  trackByIndex(index: number): number {
    return index;
  }

  hasGalleryWithMultipleImages(item: PortfolioItem): boolean {
    return !!(item?.gallery && item.gallery.length > 1);
  }

  getAddedByName(item: PortfolioItem): string {
    return item?.addedBy?.fullName || 'Unknown';
  }

  getUpdatedByName(item: PortfolioItem): string {
    return item?.updatedBy?.fullName || 'Unknown';
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
