import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminAboutUsService } from './services/admin-about-us.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-about-us',
  standalone: true,
  templateUrl: './admin-about-us.html',
  imports: [CommonModule, FormsModule, LoadingSpinner],
})
export class AdminAboutUS implements OnInit {
  aboutUs: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminAboutUsService: AdminAboutUsService) {}

  ngOnInit() {
    this.loadAboutUs();
  }

  loadAboutUs() {
    this.loading = true;
    this.error = null;

    console.log('AdminAboutUS: Starting to load about us...');

    this.adminAboutUsService.getAboutUs().subscribe({
      next: (response) => {
        console.log('AdminAboutUS: Success response:', response);

        // Handle response: if array, take first item, then aboutUs or data
        let data;
        if (Array.isArray(response)) {
          data = response[0]?.aboutUs || response[0]?.data || response[0];
        } else {
          data = response.aboutUs || response.data || response;
        }
        this.aboutUs = Array.isArray(data) ? data : [data];

        this.loading = false;
        console.log('AdminAboutUS: About us loaded:', this.aboutUs);
      },
      error: (err) => {
        console.error('AdminAboutUS: Error details:', err);
        this.error = err.message || 'Failed to load about us';
        this.loading = false;
        console.log('AdminAboutUS: Error message:', this.error);
      },
    });
  }

  isModalOpen = false;
  editMode = false;
  form: any = {
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    scrollingImages: [],
    aboutUsImages: [],
  };
  editingId: string | null = null;
  selectedScrollingImages: File[] = [];
  selectedAboutUsImages: File[] = [];

  openAddAboutUsModal() {
    this.editMode = false;
    this.form = {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      scrollingImages: [],
      aboutUsImages: [],
    };
    this.isModalOpen = true;
  }

  saveAboutUs() {
    const formData = new FormData();
    formData.append('title_en', this.form.title_en);
    formData.append('title_ar', this.form.title_ar);
    formData.append('description_en', this.form.description_en);
    formData.append('description_ar', this.form.description_ar);

    // Append scrolling images
    this.selectedScrollingImages.forEach((file) => {
      formData.append('scrollingImages', file);
    });

    // Append about us images
    this.selectedAboutUsImages.forEach((file) => {
      formData.append('aboutUsImages', file);
    });

    if (this.editMode && this.editingId) {
      this.updateAboutUs(formData);
    } else {
      // For new records, still use editAboutUs but without ID (API handles creation)
      this.updateAboutUs(formData);
    }
  }

  editAboutUs(item: any) {
    this.editMode = true;
    this.editingId = item._id || item.id;
    this.form = {
      title_en: item.title_en || '',
      title_ar: item.title_ar || '',
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      scrollingImages: item.scrollingImages || [],
      aboutUsImages: item.aboutUsImages || [],
    };
    this.selectedScrollingImages = [];
    this.selectedAboutUsImages = [];
    this.isModalOpen = true;
  }


  private updateAboutUs(formData: FormData) {
    this.loading = true;
    this.error = null;

    const request = this.editingId
      ? this.adminAboutUsService.editAboutUs(this.editingId, formData)
      : this.adminAboutUsService.editAboutUs('', formData); // API handles creation when no ID

    request.subscribe({
      next: (response: any) => {
        console.log('AdminAboutUS: About us saved successfully:', response);
        this.isModalOpen = false;
        this.loadAboutUs(); // Reload the list
      },
      error: (err: any) => {
        console.error('AdminAboutUS: Error saving about us:', err);
        this.error = err.message || 'Failed to save about us';
        this.loading = false;
      },
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onScrollingImagesChange(event: any) {
    this.selectedScrollingImages = Array.from(event.target.files);
  }

  onAboutUsImagesChange(event: any) {
    this.selectedAboutUsImages = Array.from(event.target.files);
  }
}
