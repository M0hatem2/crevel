import { Component } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { RouterLink, Router } from '@angular/router';
import { Blog } from '../../models/blog/blog';

@Component({
  selector: 'app-blog-header',
  imports: [RouterLink],
  templateUrl: './blog-header.html',
  styleUrl: './blog-header.scss'
})
export class BlogHeader {
  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  onExploreInsights(): void {
    // First check if we're already on the blog page
    if (this.router.url.includes('/blog')) {
      // If already on blog page, just scroll to the section
      Blog.scrollToBlogSection('explore-insights-section');
    } else {
      // Navigate to blog page with fragment for smooth scrolling
      this.router.navigate(['/blog'], {
        fragment: 'explore-insights-section'
      });
    }
  }
}
