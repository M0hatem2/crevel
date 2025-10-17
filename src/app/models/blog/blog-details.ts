import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { BlogCardService } from '../../shared/components/blog-card/services/blog.service';
import { Blog } from '../../models/blog.interface';
import { LoadingSpinner } from "../../shared/components/loading-spinner/loading-spinner";

interface BlogImage {
  secure_url: string;
  public_id: string;
  _id?: string;
}

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, LoadingSpinner, TranslateModule],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.scss',
})
export class BlogDetails implements OnInit {
  blog: Blog | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  currentLang: string = 'en';

  // Image carousel properties
  allImages: BlogImage[] = [];
  currentImageIndex = 0;
  imageLoadingStates: { [key: string]: boolean } = {};
  imageErrorStates: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private blogService: BlogCardService
  ) {
    this.currentLang = this.languageService.currentLanguage;
  }

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.loadBlogDetails(blogId);
    } else {
      this.hasError = true;
      this.errorMessage = 'Blog ID not found';
      this.isLoading = false;
    }
  }

  loadBlogDetails(blogId: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    // For now, we'll fetch all blogs and find the specific one
    // In a real application, you'd want a specific endpoint for individual blog details
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        const foundBlog = blogs.find(blog => blog._id === blogId);
        if (foundBlog) {
          this.blog = foundBlog;
          this.createAllImagesArray();
        } else {
          this.hasError = true;
          this.errorMessage = 'Blog not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog details:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load blog details';
        this.isLoading = false;
      }
    });
  }

  retryLoadBlog(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.loadBlogDetails(blogId);
    }
  }

  getTitle(): string {
    if (!this.blog) return '';
    return this.currentLang === 'ar'
      ? (this.blog.title_ar || this.blog.title_en)
      : this.blog.title_en;
  }

  getSubtitle(): string {
    if (!this.blog) return '';
    return this.currentLang === 'ar'
      ? (this.blog.subTitle_ar || this.blog.subTitle_en)
      : this.blog.subTitle_en;
  }

  getContent(): string {
    if (!this.blog) return '';
    return this.currentLang === 'ar'
      ? (this.blog.content_ar || this.blog.content_en)
      : this.blog.content_en;
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  // Create combined array of main image and gallery images
  private createAllImagesArray(): void {
    if (!this.blog) {
      this.allImages = [];
      return;
    }

    this.allImages = [];

    // Add main image first
    if (this.blog.image) {
      this.allImages.push(this.blog.image);
    }

    // Add gallery images
    if (this.blog.gallery && this.blog.gallery.length > 0) {
      this.allImages.push(...this.blog.gallery);
    }

    // Initialize loading and error states
    this.imageLoadingStates = {};
    this.imageErrorStates = {};
    this.allImages.forEach(img => {
      this.imageLoadingStates[img.secure_url] = true;
      this.imageErrorStates[img.secure_url] = false;
    });
  }

  // Handle image load
  onImageLoad(imageUrl: string): void {
    this.imageLoadingStates[imageUrl] = false;
  }

  // Handle image error
  onImageError(imageUrl: string): void {
    this.imageLoadingStates[imageUrl] = false;
    this.imageErrorStates[imageUrl] = true;
  }

  // Navigate to specific image
  goToImage(index: number): void {
    if (index >= 0 && index < this.allImages.length) {
      this.currentImageIndex = index;
    }
  }

  // Navigate to next image
  nextImage(): void {
    if (this.currentImageIndex < this.allImages.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0; // Loop back to first image
    }
  }

  // Navigate to previous image
  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.allImages.length - 1; // Loop to last image
    }
  }

  // Check if image is currently active
  isImageActive(index: number): boolean {
    return index === this.currentImageIndex;
  }

  // Get current image for display
  getCurrentImage(): BlogImage | null {
    return this.allImages.length > 0 ? this.allImages[this.currentImageIndex] : null;
  }

  // Check if we have any images to display
  hasImages(): boolean {
    return this.allImages.length > 0;
  }
}