import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Subscription } from 'rxjs';
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-our-services',
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './our-services.html',
  styleUrl: './our-services.scss'
})
export class OurServices implements OnInit, OnDestroy {
  services: any[] = [];
  loading = false;
  error: string | null = null;
  private languageSubscription: Subscription = new Subscription();

  @Input() limit: number | null = null; // null means show all services
  @Output() serviceCardClick = new EventEmitter<any>();

  constructor(private apiService: ApiService, private languageService: LanguageService, private router: Router) { }

  ngOnInit(): void {
    this.languageSubscription.add(
      this.languageService.currentLanguage$.subscribe(() => {
        this.fetchServices();
      })
    );
    this.fetchServices();
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  get currentLanguage(): string {
    return this.languageService.currentLanguage;
  }

  get displayedServices(): any[] {
    if (this.limit && this.limit > 0) {
      return this.services.slice(0, this.limit);
    }
    return this.services;
  }

  fetchServices(): void {
    this.loading = true;
    this.error = null;
    const currentLang = this.languageService.currentLanguage;
    console.log('🔄 Fetching services for language:', currentLang);

    this.apiService.get(`service/services?lang=${currentLang}&seeMore=true`).subscribe({
      next: (res: any) => {
        console.log('✅ API response received:', res);
        this.services = res.data?.data || [];
        console.log('📊 Services loaded:', this.services.length, 'items');
        this.loading = false;

        // If no data from API, use fallback
        if (this.services.length === 0) {
          console.log('⚠️ No data from API, using fallback');
         }
      },
      error: (err: any) => {
        console.error('❌ Error fetching services:', err);
        this.loading = false;
        this.error = 'Unable to load services. Please try again later.';

        // Provide fallback data when API fails, based on current language
        console.log('🔄 Using fallback data for language:', currentLang);
       }
    });
  }

  navigateToServiceDetails(service: any): void {
    if (service && service._id) {
      this.serviceCardClick.emit(service);
    }
  }

}
