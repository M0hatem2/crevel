import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminPortfolioService } from './services/admin-Portfolio.service';
import { PortfolioItem } from '../../../models/portfolio';
import { PortfolioDetailsModal } from './portfolio-details-modal';

@Component({
  selector: 'app-admin-portfolio',
  imports: [CommonModule, ReactiveFormsModule, PortfolioDetailsModal],
  templateUrl: './admin-portfolio.html',
  styleUrl: './admin-portfolio.scss'
})
export class AdminPortfolio implements OnInit {
  portfolioForm!: FormGroup;
  categories: string[] = [];
  selectedMainImage: File | null = null;
  selectedGalleryImages: File[] = [];
  selectedGalleryImageUrls: string[] = [];
  isSubmitting = false;
  submitMessage = '';
  isEditMode = false;
  editingProjectId: string | null = null;
  portfolioItems: PortfolioItem[] = [];

  // Modal properties
  showDetailsModal = false;
  selectedPortfolioItem: PortfolioItem | null = null;

  constructor(
    private fb: FormBuilder,
    private portfolioService: AdminPortfolioService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.loadPortfolioItems();
  }

  private initializeForm(): void {
    this.portfolioForm = this.fb.group({
      title_en: ['', [Validators.required, Validators.minLength(3)]],
      title_ar: ['', [Validators.required, Validators.minLength(3)]],
      description_en: ['', [Validators.required, Validators.minLength(10)]],
      description_ar: ['', [Validators.required, Validators.minLength(10)]],
      githubRepo: ['', [Validators.pattern('https?://.+')]],
      productionUrl: ['', [Validators.pattern('https?://.+')]],
      category: ['', Validators.required]
    });
  }
 
  loadPortfolioItems(): void {
    this.portfolioService.getPortfolioItems().subscribe({
      next: (items) => {
        this.portfolioItems = items;
        console.log('Loaded portfolio items:', this.portfolioItems);
      },
      error: (error) => {
        console.error('Error loading portfolio items:', error);
      }
    });
  }

  private loadCategories(): void {
    this.portfolioService.getCategories().subscribe({
      next: (categories: string[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        // Fallback categories if API fails
        this.categories = ['Web Development', 'Mobile App', 'Desktop App', 'UI/UX Design','software'];
      }
    });
  }

  onMainImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedMainImage = file;
    }
  }

  onGalleryImagesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0 && files.length <= 5) {
      this.selectedGalleryImages = files;
      this.selectedGalleryImageUrls = files.map(file => URL.createObjectURL(file));
    } else if (files.length > 5) {
      alert('Maximum 5 gallery images allowed');
      event.target.value = '';
    }
  }

  removeGalleryImage(index: number): void {
    URL.revokeObjectURL(this.selectedGalleryImageUrls[index]);
    this.selectedGalleryImages.splice(index, 1);
    this.selectedGalleryImageUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      // Check if files are required for add mode
      if (!this.isEditMode && (!this.selectedMainImage || this.selectedGalleryImages.length === 0)) {
        this.submitMessage = 'Please select both main image and at least one gallery image.';
        return;
      }

      this.isSubmitting = true;
      this.submitMessage = '';

      const formData = new FormData();

      // Add form fields
      Object.keys(this.portfolioForm.value).forEach(key => {
        if (this.portfolioForm.value[key]) {
          formData.append(key, this.portfolioForm.value[key]);
        }
      });

      // Add main image if selected (optional in edit mode)
      if (this.selectedMainImage) {
        formData.append('image', this.selectedMainImage);
      }

      // Add gallery images if selected (optional in edit mode)
      this.selectedGalleryImages.forEach((file, index) => {
        formData.append(`gallery`, file);
      });

      const successMessage = 'Operation successfully';

      if (this.isEditMode && this.editingProjectId) {
        this.portfolioService.updatePortfolioItem(this.editingProjectId, formData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.submitMessage = successMessage;
            this.loadPortfolioItems();
            console.log('Response:', response);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.submitMessage = 'Error updating portfolio item. Please try again.';
            console.error('Error:', error);
          }
        });
      } else {
        this.portfolioService.addPortfolioItem(formData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.submitMessage = successMessage;
            this.resetForm();
            this.loadPortfolioItems();
          },
          error: (error) => {
            this.isSubmitting = false;
            this.submitMessage = 'Error adding portfolio item. Please try again.';
            console.error('Error:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  editProject(project: PortfolioItem): void {
    this.isEditMode = true;
    this.editingProjectId = project._id!;

    // Populate form with existing data
    this.portfolioForm.patchValue({
      title_en: project.title_en,
      title_ar: project.title_ar,
      description_en: project.description_en,
      description_ar: project.description_ar,
      githubRepo: project.githubRepo,
      productionUrl: project.productionUrl,
      category: project.category
    });

    // Clear selected files since they're optional in edit mode
    this.selectedMainImage = null;
    this.selectedGalleryImages = [];
    this.selectedGalleryImageUrls.forEach(url => URL.revokeObjectURL(url));
    this.selectedGalleryImageUrls = [];

    // Reset file inputs
    const mainImageInput = document.getElementById('mainImage') as HTMLInputElement;
    const galleryInput = document.getElementById('galleryImages') as HTMLInputElement;
    if (mainImageInput) mainImageInput.value = '';
    if (galleryInput) galleryInput.value = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingProjectId = null;
    this.resetForm();
  }

  deleteProject(id: string | undefined): void {
    if (!id) {
      alert('Invalid item ID');
      return;
    }
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      this.portfolioService.deletePortfolioItem(id).subscribe({
        next: (response) => {
          this.loadPortfolioItems();
          // Close modal if it's open and the deleted item was selected
          if (this.showDetailsModal && this.selectedPortfolioItem?._id === id) {
            this.closeDetailsModal();
          }
        },
        error: (error) => {
          console.error('Error deleting portfolio item:', error);
          const errorMessage = error?.error?.message || 'Error deleting portfolio item. Please try again.';
          // If the server returns a specific error but deletion might have succeeded, reload anyway
          if (errorMessage === 'Cannot read properties of undefined (reading \'reason\')') {
            this.loadPortfolioItems();
            // Close modal if it's open and the deleted item was selected
            if (this.showDetailsModal && this.selectedPortfolioItem?._id === id) {
              this.closeDetailsModal();
            }
          } else {
            alert(errorMessage);
          }
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.portfolioForm.controls).forEach(key => {
      const control = this.portfolioForm.get(key);
      control?.markAsTouched();
    });
  }

  resetForm(): void {
    this.portfolioForm.reset();
    this.selectedMainImage = null;
    this.selectedGalleryImages = [];
    this.selectedGalleryImageUrls.forEach(url => URL.revokeObjectURL(url));
    this.selectedGalleryImageUrls = [];
    this.submitMessage = '';
    this.isEditMode = false;
    this.editingProjectId = null;

    // Reset file inputs
    const mainImageInput = document.getElementById('mainImage') as HTMLInputElement;
    const galleryInput = document.getElementById('galleryImages') as HTMLInputElement;
    if (mainImageInput) mainImageInput.value = '';
    if (galleryInput) galleryInput.value = '';
  }

  // Modal methods
  openDetailsModal(item: PortfolioItem): void {
    this.selectedPortfolioItem = item;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedPortfolioItem = null;
  }

  editProjectFromModal(item: PortfolioItem): void {
    this.editProject(item);
  }

  deleteProjectFromModal(id: string): void {
    this.deleteProject(id);
  }

  // Helper methods for template
  get titleEn() { return this.portfolioForm.get('title_en'); }
  get titleAr() { return this.portfolioForm.get('title_ar'); }
  get descriptionEn() { return this.portfolioForm.get('description_en'); }
  get descriptionAr() { return this.portfolioForm.get('description_ar'); }
  get category() { return this.portfolioForm.get('category'); }
  get githubRepo() { return this.portfolioForm.get('githubRepo'); }
  get productionUrl() { return this.portfolioForm.get('productionUrl'); }
}
