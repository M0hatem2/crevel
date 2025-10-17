import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';""
import { AdminBlogService } from './services/admin-blog.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  templateUrl: './admin-blog.html',
  imports: [CommonModule, FormsModule, LoadingSpinner],
})
export class AdminBlog implements OnInit {
  blogs: any[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;
  imagePreviews: { [key: string]: string } = {};

  constructor(private adminBlogService: AdminBlogService) {}

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.loading = true;
    this.error = null;

    console.log('AdminBlog: Starting to load blogs...');

    this.adminBlogService.getBlogs().subscribe({
      next: (response) => {
        console.log('AdminBlog: Success response:', response);

        // Handle different response formats
        this.blogs = response.blogs?.data || response.data || response;

        this.loading = false;
        console.log('AdminBlog: Blogs loaded:', this.blogs);
      },
      error: (err) => {
        console.error('AdminBlog: Error details:', err);
        this.error = err.message || 'Failed to load blogs';
        this.loading = false;
        console.log('AdminBlog: Error message:', this.error);
      },
    });
  }

  isModalOpen = false;
  editMode = false;
  form: any = {
    title_en: '',
    subTitle_en: '',
    content_en: '',
    category: '',
    title_ar: '',
    subTitle_ar: '',
    content_ar: '',
    image: null,
    gallery: [],
    newImage: null,
    newGalleryImages: [],
    removedGalleryImages: [],
  };
  editingIndex: number | null = null;

  openAddBlogModal() {
    this.editMode = false;
    this.form = {
      title_en: '',
      subTitle_en: '',
      content_en: '',
      category: '',
      title_ar: '',
      subTitle_ar: '',
      content_ar: '',
      image: null,
      gallery: [],
      newImage: null,
      newGalleryImages: [],
      removedGalleryImages: [],
    };
    this.isModalOpen = true;
  }

  editBlog(blog: any) {
    this.editMode = true;
    this.form = {
      ...blog,
      newImage: null,
      newGalleryImages: [],
      removedGalleryImages: [],
    };
    this.editingIndex = this.blogs.indexOf(blog);
    this.isModalOpen = true;
  }

  saveBlog() {
    // Form validation
    if (!this.form.title_en || !this.form.title_ar) {
      this.error = 'Title in both English and Arabic is required';
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    // Create clean data object with all required fields including image and gallery
    const allowedFields = [
      'title_en',
      'title_ar',
      'subTitle_en',
      'subTitle_ar',
      'content_en',
      'content_ar',
      'category',
      'image',
      'gallery'
    ];

    const cleanData: any = {};
    allowedFields.forEach(field => {
      if (this.form[field] !== undefined && this.form[field] !== null) {
        cleanData[field] = this.form[field];
      }
    });

    if (this.editMode && this.editingIndex !== null) {
      // Edit existing blog - send only allowed fields
      this.adminBlogService.editBlog(this.form._id, cleanData).subscribe({
        next: () => {
          this.success = 'Blog updated successfully!';
          this.loadBlogs(); // Reload the list
          setTimeout(() => {
            this.closeModal();
            this.success = null;
          }, 1500);
          this.saving = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to update blog';
          this.saving = false;
        },
      });
    } else {
      // Add new blog - send only allowed fields
      this.adminBlogService.addBlog(cleanData).subscribe({
        next: () => {
          this.success = 'Blog added successfully!';
          this.loadBlogs(); // Reload the list
          setTimeout(() => {
            this.closeModal();
            this.success = null;
          }, 1500);
          this.saving = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to add blog';
          this.saving = false;
        },
      });
    }
  }

  deleteBlog(blog: any) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.adminBlogService.deleteBlog(blog._id).subscribe({
        next: () => {
          this.loadBlogs(); // Reload the list
        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }

  // Image management methods
  async onMainImageChange(event: any) {
    // Temporarily disabled until separate image API is implemented
    this.error = 'Main image updates require API update. This feature will be available soon.';
    // Clear the file input
    event.target.value = '';
    // Auto-clear error after 3 seconds
    setTimeout(() => {
      this.error = null;
    }, 3000);
  }

  async addGalleryImage(event: any) {
    // Temporarily disabled until separate image API is implemented
    this.error = 'Gallery image uploads require API update. This feature will be available soon.';
    // Clear the file input
    event.target.value = '';
    // Auto-clear error after 3 seconds
    setTimeout(() => {
      this.error = null;
    }, 3000);
  }

  removeGalleryImage(index: number) {
    // Temporarily disabled until separate image API is implemented
    this.error = 'Gallery image removal requires API update. This feature will be available soon.';
    // Auto-clear error after 3 seconds
    setTimeout(() => {
      this.error = null;
    }, 3000);
  }

  removeNewGalleryImage(index: number) {
    const removedFile = this.form.newGalleryImages[index];
    if (removedFile && removedFile.name) {
      delete this.imagePreviews[removedFile.name];
    }
    this.form.newGalleryImages.splice(index, 1);
  }

  getImagePreviewSync(file: File): string {
    return this.imagePreviews[file.name] || '';
  }

  getMainImagePreview(): string {
    return this.imagePreviews['main_' + (this.form.newImage?.name || '')] || '';
  }

  async getImagePreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  triggerFileInput() {
    // This function is disabled until separate image API is implemented
    console.log('Image upload disabled - requires separate API endpoint');
  }

  closeModal() {
    this.isModalOpen = false;
    this.error = null;
    this.success = null;
    this.imagePreviews = {}; // Clear image previews
  }
}
