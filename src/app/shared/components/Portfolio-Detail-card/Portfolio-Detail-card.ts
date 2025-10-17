import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioItem, PortfolioImage } from '../../../models/portfolio';
import { PortfolioService } from './services/portfolio-details.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'app-portfolio-detail-card',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './portfolio-detail-card.html',
  styleUrls: ['./Portfolio-Detail-card.scss'],
})
export class PortfolioDetailCard implements OnInit {
  portfolioItem: PortfolioItem | null = null;
  loading = false;
  errorMessage = '';
  selectedLanguage: 'en' | 'ar' = 'ar'; // Default to Arabic as per API
  allImages: PortfolioImage[] = [];
  currentImageIndex = 0;
  imageLoadingStates: { [key: string]: boolean } = {};
  imageErrorStates: { [key: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    // Read language from localStorage
    const savedLang = localStorage.getItem('lang') as 'en' | 'ar';
    this.selectedLanguage = savedLang || 'ar';

    // Get the portfolio ID from route parameters
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPortfolioItem(id);
      } else {
        this.errorMessage = 'Portfolio ID not found';
      }
    });
  }

  loadPortfolioItem(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    // Use the new service method to get portfolio by ID
    (this.portfolioService as any).getPortfolioById(id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          // Map the API response to PortfolioItem format
          this.portfolioItem = {
            _id: response.data._id,
            title_en: response.data.title_en,
            title_ar: response.data.title_ar || response.data.title_en,
            description_en: response.data.description_en,
            description_ar: response.data.description_ar || response.data.description_en,
            category: response.data.category,
            category_en: response.data.category_en || response.data.category,
            category_ar: response.data.category_ar || response.data.category,
            image: response.data.image,
            gallery: response.data.gallery || [],
            productionUrl: response.data.productionUrl,
            githubRepo: response.data.githubRepo,
            addedBy: {
              fullName: 'Unknown',
              profilePic: '',
              email: '',
              role: 'user'
            }
          };
        } else {
          this.errorMessage = 'Portfolio item not found';
        }
        this.loading = false;

        // Create combined images array after loading portfolio item
        if (this.portfolioItem) {
          this.createAllImagesArray();
        }
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load portfolio item';
        this.loading = false;
        console.error('Error loading portfolio item:', error);
      },
    });
  }

  getCurrentTitle(item: PortfolioItem): string {
    if (!item) return '';
    return this.selectedLanguage === 'en'
      ? item.title_en
      : item.title_ar || item.title_en;
  }
 
  getCurrentDescription(item: PortfolioItem): string {
    if (!item) return '';
    return this.selectedLanguage === 'en'
      ? item.description_en
      : item.description_ar || item.description_en;
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }

  viewProjectDetails(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/portfolio', id]);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackById(index: number, item: PortfolioItem): string {
    return item._id || index.toString();
  }

  retryLoadPortfolio(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPortfolioItem(id);
      }
    });
  }

  // Create combined array of main image and gallery images
  private createAllImagesArray(): void {
    if (!this.portfolioItem) {
      this.allImages = [];
      return;
    }

    this.allImages = [];

    // Add main image first
    if (this.portfolioItem.image) {
      this.allImages.push(this.portfolioItem.image);
    }

    // Add gallery images
    if (this.portfolioItem.gallery && this.portfolioItem.gallery.length > 0) {
      this.allImages.push(...this.portfolioItem.gallery);
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
  getCurrentImage(): PortfolioImage | null {
    return this.allImages.length > 0 ? this.allImages[this.currentImageIndex] : null;
  }

  // Check if we have any images to display
  hasImages(): boolean {
    return this.allImages.length > 0;
  }
}
