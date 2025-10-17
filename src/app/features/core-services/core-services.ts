import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ServiceItem } from '../../models/web-services/interfaces/service.interface';
import { ServiceService } from '../../models/web-services/services/service.service';
import { environment } from '../../../environments/environment';
import { CoreService } from './services/core.service';
import { LanguageService } from '../../core/services/language.service';
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-core-services',
  imports: [CommonModule, TranslateModule, LoadingSpinner],
  templateUrl: './core-services.html',
  styleUrl: './core-services.scss',
})
export class CoreServices implements OnInit {
  services: ServiceItem[] = [];
  loading = true;
  error: string | null = null;
  showModal = false;
  selectedServiceData: any = null;
  modalLoading = false;
  currentLanguage = 'en';

  constructor(
    private serviceService: CoreService,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.currentLanguage;
    this.loadServices();

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;

    this.serviceService.getServices().subscribe({
      next: (response) => {
        this.services = response.data.data;
        this.loading = false;
        console.log('Services loaded:', this.services);
      },
      error: (error) => {
        this.error = this.languageService.getTranslationSync('ERRORS.LOAD_FAILED') || 'Failed to load services. Please try again later.';
        this.loading = false;
        console.error('Error loading services:', error);
      },
    });
  }

  onServiceClick(service: ServiceItem): void {
    // Show modal with service details
    console.log('Opening modal for service:', service.title_en, 'ID:', service._id);
    this.openServiceModal(service._id);
  }

  openServiceModal(serviceId: string): void {
    this.modalLoading = true;
    this.showModal = true;

    // Fetch service details from the specific API endpoint
    this.serviceService.getServiceByIdWithLang(serviceId).subscribe({
      next: (response: any) => {
        this.selectedServiceData = response.data;
        this.modalLoading = false;
        console.log('Service details loaded:', this.selectedServiceData);
      },
      error: (error: any) => {
        console.error('Error loading service details:', error);
        this.modalLoading = false;
        this.error = this.languageService.getTranslationSync('ERRORS.LOAD_FAILED') || 'Failed to load service details. Please try again later.';
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedServiceData = null;
    this.error = null;
  }

  trackByServiceId(index: number, service: ServiceItem): string {
    return service._id;
  }

  getServiceIcon(iconValue: string): string {
    // Map common icon values to proper FontAwesome icons
    const iconMap: { [key: string]: string } = {
      'fa-icon': 'fa-code',
      'back-icon': 'fa-arrow-left',
      'fai-icon': 'fa-star',
      software: 'fa-laptop-code',
      'UI UX': 'fa-palette',
    };

    // Check if it's already a valid FontAwesome class (starts with fa-)
    if (iconValue && iconValue.startsWith('fa-')) {
      return iconValue;
    }

    // Return mapped icon or default
    return iconMap[iconValue] || 'fa-star';
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
