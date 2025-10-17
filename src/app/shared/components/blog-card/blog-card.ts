import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { Blog } from '../../../models/blog.interface';
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

@Component({
  selector: 'app-blog-card',
  imports: [CommonModule, TranslateModule, LoadingSpinner],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  @Input() blog!: Blog;
  currentLang: string = 'en';
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(private languageService: LanguageService, private router: Router) {
    this.currentLang = this.languageService.currentLanguage;
  }

  getTitle(): string {
    return this.currentLang === 'ar'
      ? this.blog.title_ar || this.blog.title_en
      : this.blog.title_en;
  }

  getContent(): string {
    return this.currentLang === 'ar'
      ? this.blog.content_ar || this.blog.content_en
      : this.blog.content_en;
  }

  onImageLoad(): void {
    this.isLoading = false;
  }

  onImageError(): void {
    this.isLoading = false;
    this.hasError = true;
  }

  navigateToDetails(event: Event): void {
    event.preventDefault();
    if (this.blog && this.blog._id) {
      this.router.navigate(['/blog', this.blog._id]);
    }
  }

  getReadMoreText(): string {
    return this.currentLang === 'ar' ? 'اقرأ المزيد' : 'Read More';
  }

  getArrowClass(): string {
    return this.currentLang === 'ar' ? 'fa-soli d fa-arrow-right' : 'fa-solid fa-arrow-left';
  }

  getCardClasses(): string {
    return this.currentLang === 'ar'
      ? 'portfolio-card bg-[#2a4a4c] rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(87,196,193,0.3)] cursor-pointer overflow-hidden arabic-font'
      : 'portfolio-card bg-[#2a4a4c] rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(87,196,193,0.3)] cursor-pointer overflow-hidden';
  }

  getContentClasses(): string {
    return this.currentLang === 'ar' ? 'p-6 rtl-text' : 'p-6';
  }

  getDirection(): string {
    return this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}
