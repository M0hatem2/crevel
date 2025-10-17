import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TranslateModule } from '@ngx-translate/core';

interface FooterData {
  email?: string;
  mobile?: string;
  website?: {
    name?: string;
    url?: string;
  };
  location?: {
    title_en?: string;
    title_ar?: string;
    url?: string;
  };
  logo?: {
    public_id?: string;
    secure_url?: string;
  };
  social?: Array<{
    platform?: string;
    url?: string;
    _id?: string;
  }>;
  copyright?: string;
}

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule, TranslateModule],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss'
})
export class PrivacyPolicy implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  currentDate = new Date();
  footerData: FooterData = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadFooterData();
  }

  private loadFooterData() {
    this.apiService.get<{ footer: FooterData }>('public/footer').subscribe({
      next: (response) => {
        this.footerData = response.footer || {};
      },
      error: (error) => {
        console.error('Failed to load footer data:', error);
        // Fallback to default values
        this.footerData = {
          email: 'hello@crevel.agency',
          mobile: '+966 (___)',
          website: {
            name: 'crevel.agency',
            url: 'https://crevel.agency'
          },
          location: {
            title_en: 'Maadi, Cairo, Egypt',
            title_ar: 'المعادي، القاهرة، مصر',
            url: 'https://maps.google.com/?q=29.971630,31.288393'
          }
        };
      }
    });
  }

  close() {
    this.closeModal.emit();
  }
}
