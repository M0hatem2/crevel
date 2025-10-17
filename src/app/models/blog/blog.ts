import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Topics } from '../../shared/components/topics/topics';
import { ContactUs } from '../../features/contact-us/contact-us';
import { BlogCard } from '../../shared/components/blog-card/blog-card';
import { BlogCardService } from '../../shared/components/blog-card/services/blog.service';
import { Blog as BlogInterface } from '../../models/blog.interface';
import { BlogHeader } from '../../features/blog-header/blog-header';
import { BlogsCards } from "../../shared/components/blogs-cards/blogs-cards";
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, TranslateModule, Topics, ContactUs, BlogCard, BlogHeader, BlogCard, BlogsCards],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit, AfterViewInit {
  blogs: BlogInterface[] = [];

  constructor(
    private blogService: BlogCardService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
        console.log('Fetched blogs:', this.blogs);
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
      },
    });
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Static method to allow scrolling from other components
  static scrollToBlogSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  ngAfterViewInit(): void {
    // Check if there's a fragment in the URL (for direct links)
    const fragment = window.location.hash.substring(1);
    if (fragment) {
      setTimeout(() => {
        this.scrollToSection(fragment);
      }, 100);
    }
  }
}
