import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderService, SocialMediaLink } from './services/header.service';
import { LanguageService, Language } from '../../core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit {
  socialMediaLinks: SocialMediaLink[] = [];
  currentLanguage: Language = 'en';

  constructor(
    private headerService: HeaderService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadSocialMediaLinks();
    this.currentLanguage = this.languageService.currentLanguage;
    this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  private loadSocialMediaLinks(): void {
    this.headerService.getSocialMediaLinks().subscribe({
      next: (links) => {
        this.socialMediaLinks = links;
      },
      error: (error) => {
        console.error('Error loading social media links:', error);
      }
    });
  }

  getSocialIconClass(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'fa-brands fa-facebook-f';
      case 'linkedin':
        return 'fa-brands fa-linkedin-in';
      case 'instagram':
      case 'instgram': // Handle typo in API data
        return 'fa-brands fa-instagram';
      default:
        return 'fa-brands fa-link';
    }
  }

  getSocialIconClasses(platform: string): string {
    const baseClasses = 'text-white px-6 text-xl transition';
    const hoverClass = this.getHoverClass(platform.toLowerCase());
    return `${baseClasses} hover:${hoverClass}`;
  }

  private getHoverClass(platform: string): string {
    switch (platform) {
      case 'facebook':
        return 'text-blue-500';
      case 'linkedin':
        return 'text-blue-700';
      case 'instagram':
      case 'instgram':
        return 'text-pink-500';
      default:
        return 'text-gray-400';
    }
  }
}
