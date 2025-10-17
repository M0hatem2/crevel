import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PortfolioService } from './services/PortfolioCards.service';
import { LanguageService, Language } from '../../core/services/language.service';
import { Subscription } from 'rxjs';
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-portfolio-cards',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './portfolio-cards.html',
  styleUrls: ['./portfolio-cards.scss'],
})
export class PortfolioCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  private url = environment.baseUrl;
  currentLang: Language = 'en';
  private subscription: Subscription = new Subscription();
  constructor(private por: PortfolioService, private languageService: LanguageService) {}

  // API data
  portfolioItems: any[] = [];
  isLoading = true;
  private originalCards = [
    { id: 1, title: 'SOCIAL\nMEIDA\nDESIGNE', active: false },
    { id: 2, title: 'SOCIAL\nMEIDA\nDESIGNE', active: false },
    { id: 3, title: 'SOCIAL\nMEIDA\nDESIGNE', active: true },
    { id: 4, title: 'SOCIAL\nMEIDA\nDESIGNE', active: false },
    { id: 5, title: 'SOCIAL\nMEIDA\nDESIGNE', active: false },
    { id: 6, title: 'SOCIAL\nMEIDA\nDESIGNE', active: false },
    { id: 7, title: 'SOCIAL\nMEIDA\nDESIGNE', active: false },
  ];

  cards: any[] = [];

  getData() {
    this.isLoading = true;
    this.por.getPortfolio().subscribe({
      next: (data) => {
        console.log(data);
        this.portfolioItems = data.data.data;
        this.initializeCards();
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
  ngOnInit(): void {
    this.getData();
    // Get current language from LanguageService
    this.currentLang = this.languageService.currentLanguage;

    // Subscribe to language changes from LanguageService
    this.subscription.add(
      this.languageService.currentLanguage$.subscribe((lang: Language) => {
        this.currentLang = lang;
        // Refresh data when language changes
        this.getData();
      })
    );
  }

  ngAfterViewInit(): void {
    this.updateActiveCard();
  }

  private initializeCards(): void {
    if (this.portfolioItems.length > 0) {
      // Use API data
      this.cards = this.portfolioItems.map((item, index) => ({
        id: item._id,
        title: this.currentLang === 'ar' ? item.title_ar : item.title_en,
        description: this.currentLang === 'ar' ? item.description_ar : item.description_en,
        category: item.category,
        image: item.image?.secure_url,
        cardIndex: index,
      }));
    } else {
      // Fallback to original cards if no API data
      this.cards = this.originalCards.map((card, index) => ({
        ...card,
        id: index + 1,
        cardIndex: index,
      }));
    }
  }

  // Get card color based on card index
  getCardColor(index: number): string {
    const colors = ['#5196A6', '#18765C', '#50A796'];
    return colors[index % colors.length];
  }

  // Get card shadow based on color
  getCardShadow(color: string): string {
    const shadowMap: { [key: string]: string } = {
      '#5196A6': '0px 20px 20px 9px #5196A6',
      '#18765C': '0px 20px 20px 9px #18765C',
      '#50A796': '0px 20px 20px 9px #50A796',
    };
    return shadowMap[color] || '0px 20px 20px 9px #00fff8';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scrollLeft(): void {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = 100 + 20; // card width + gap
    const scrollAmount = cardWidth;

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(() => this.updateActiveCard(), 300);
  }

  scrollRight(): void {
    const container = this.carouselContainer.nativeElement;
    const cardWidth = 100 + 20; // card width + gap
    const scrollAmount = cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(() => this.updateActiveCard(), 300);
  }

  private updateActiveCard(): void {
    const container = this.carouselContainer.nativeElement as HTMLElement;
    const cards: NodeListOf<HTMLElement> = container.querySelectorAll('.card');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestCard: HTMLElement | null = null;
    let closestDistance = Infinity;

    Array.from(cards).forEach((card: HTMLElement) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    // Remove active class from all cards
    Array.from(cards).forEach((card: HTMLElement) => {
      card.classList.remove('active', 'center');
    });

    // Add active class to closest card
    if (closestCard) {
      (closestCard as any).classList.add('active', 'center');
    }
  }
}
