import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdminServicesService } from './services/admin-services.service';
import { LanguageService } from '../../../core/services/language.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-services',
  standalone: true,
  templateUrl: './admin-services.html',
  imports: [CommonModule, FormsModule, TranslateModule, LoadingSpinner],
})
export class AdminServices implements OnInit {
  services: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private adminServicesService: AdminServicesService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.error = null;
    this.adminServicesService.getServices().subscribe({
      next: (response) => {
        this.services = response.services.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load services';
        this.loading = false;
      },
    });
  }

  isModalOpen = false;
  editMode = false;
  form: any = { icon: '' };
  editingIndex: number | null = null;

  openAddServiceModal() {
    this.editMode = false;
    this.form = { title_en: '', title_ar: '', description_en: '', description_ar: '', icon: '' };
    this.isModalOpen = true;
  }

  editService(service: any) {
    this.editMode = true;
    // Copy all fields for editing
    this.form = {
      title_en: service.title_en || '',
      title_ar: service.title_ar || '',
      description_en: service.description_en || '',
      description_ar: service.description_ar || '',
      icon: service.icon || ''
    };
    this.editingIndex = this.services.indexOf(service);
    this.isModalOpen = true;
  }

  saveService() {
    if (this.editMode && this.editingIndex !== null) {
      // Edit existing service - send complete service object
      const serviceToUpdate = this.services[this.editingIndex];
      this.adminServicesService.editService(serviceToUpdate._id, this.form).subscribe({
        next: () => {
          this.loadServices(); // Reload the list
          this.closeModal();
        },
        error: (err) => {
          this.error = err.message;
        },
      });
    } else {
      // Add new service
      this.adminServicesService.addService(this.form).subscribe({
        next: () => {
          this.loadServices(); // Reload the list
          this.closeModal();
        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }

  deleteService(service: any) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.adminServicesService.deleteService(service._id).subscribe({
        next: () => {
          this.loadServices(); // Reload the list
        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
