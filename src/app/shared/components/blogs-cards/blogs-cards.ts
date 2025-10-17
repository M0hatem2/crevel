import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-blogs-cards',
  imports: [CommonModule, TranslateModule,RouterLink],
  templateUrl: './blogs-cards.html',
  styleUrl: './blogs-cards.scss'
})
export class BlogsCards {
  isReadMoreLoading = false;
  isExploreLoading = false;

  constructor(private router: Router, private translate: TranslateService, public languageService: LanguageService) {}

  get currentLang(): string {
    return this.languageService.currentLanguage;
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }

  onReadMore(): void {
    if (this.isReadMoreLoading) return;

    this.isReadMoreLoading = true;

    // Navigate to blog page with enhanced functionality
    this.router.navigate(['/blog']).then(() => {
      // Wait for page load, then scroll to featured blogs section
      setTimeout(() => {
        const blogSection = document.querySelector('.blog-cards-section') ||
                           document.querySelector('.blogs-container') ||
                           document.getElementById('blogs-section');

        if (blogSection) {
          // Add highlight effect
          blogSection.classList.add('blogs-highlight');

          // Smooth scroll to section
          blogSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Remove highlight after animation
          setTimeout(() => {
            blogSection.classList.remove('blogs-highlight');
          }, 2000);
        }

        this.isReadMoreLoading = false;
      }, 300);
    }).catch(() => {
      this.isReadMoreLoading = false;
    });
  }

  onExploreInsights(): void {
    if (this.isExploreLoading) return;

    this.isExploreLoading = true;

    // Navigate to blog page and scroll to insights section with enhanced animation
    this.router.navigate(['/blog']).then(() => {
      setTimeout(() => {
        const insightsSection = document.querySelector('.insights-section') ||
                               document.querySelector('.explore-insights') ||
                               document.getElementById('explore-insights-section');

        if (insightsSection) {
          // Add special highlight effect for insights
          insightsSection.classList.add('insights-highlight');

          // Smooth scroll with slight delay for dramatic effect
          setTimeout(() => {
            insightsSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 200);

          // Remove highlight after animation
          setTimeout(() => {
            insightsSection.classList.remove('insights-highlight');
          }, 3000);
        } else {
          // If no specific section found, scroll to top of blog page
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }

        this.isExploreLoading = false;
      }, 400);
    }).catch(() => {
      this.isExploreLoading = false;
    });
  }
}
