import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HowWeSucceedService } from './services/HowWeSucceed.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-how-we-succeed',
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './admin-how-we-succeed.html',
  styleUrl: './admin-how-we-succeed.scss',
})
export class AdminHowWeSucceed implements OnInit {
  items: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private howWeSucceedService: HowWeSucceedService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.error = null;

    console.log('AdminHowWeSucceedComponent: Starting to load items...');

    this.howWeSucceedService.getHowWeSucceedItems().subscribe({
      next: (response: any) => {
        console.log('AdminHowWeSucceedComponent: Success response:', response);

        // Handle different response formats
        let items: any[] = [];
        if (Array.isArray(response)) {
          items = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          items = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          items = response.data;
        } else {
          items = [];
        }

        this.items = items;
        this.loading = false;
        console.log('AdminHowWeSucceedComponent: Items loaded:', this.items);
      },
      error: (err) => {
        console.error('AdminHowWeSucceedComponent: Error details:', err);
        this.error = err.message || 'Failed to load items';
        this.loading = false;
        console.log('AdminHowWeSucceedComponent: Error message:', this.error);
      },
    });
  }

  // Modal properties
  isModalOpen = false;
  isDetailsModalOpen = false;
  editMode = false;
  form: any = { title_en: '', title_ar: '', description_en: '', description_ar: '' };
  editingIndex: number | null = null;
  selectedItem: any = null;

  openAddModal() {
    this.editMode = false;
    this.form = { title_en: '', title_ar: '', description_en: '', description_ar: '' };
    this.isModalOpen = true;
  }

  editItem(item: any) {
    this.editMode = true;
    this.form = { title_en: item.title_en || '', title_ar: item.title_ar || '', description_en: item.description_en || '', description_ar: item.description_ar || '' };
    this.editingIndex = this.items.indexOf(item);
    this.isModalOpen = true;
  }


  saveItem() {
    if (!this.form.title_en || !this.form.title_ar || !this.form.description_en || !this.form.description_ar) {
      this.error = 'All fields are required';
      return;
    }

    const data = {
      title_en: this.form.title_en,
      title_ar: this.form.title_ar,
      description_en: this.form.description_en,
      description_ar: this.form.description_ar
    };

    if (this.editMode && this.editingIndex !== null) {
      // Update existing item
      const itemId = this.items[this.editingIndex]._id;
      this.howWeSucceedService.updateHowWeSucceedItem(itemId, data).subscribe({
        next: () => {
          this.loadItems(); // Reload the list
          this.closeModal();
        },
        error: (err) => {
          this.error = err.message || 'Failed to update item';
        },
      });
    } else {
      // Add new item
      this.howWeSucceedService.addHowWeSucceedItem(data).subscribe({
        next: () => {
          this.loadItems(); // Reload the list
          this.closeModal();
        },
        error: (err) => {
          this.error = err.message || 'Failed to add item';
        },
      });
    }
  }

  deleteItem(item: any) {
    const reason = prompt('Please provide a reason for deletion (optional):');
    if (confirm('Are you sure you want to delete this item?')) {
      this.howWeSucceedService.deleteHowWeSucceedItem(item._id, reason || undefined).subscribe({
        next: () => {
          this.loadItems(); // Reload the list
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete item';
        },
      });
    }
  }

  viewDetails(item: any) {
    this.selectedItem = item;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.selectedItem = null;
  }

  closeModal() {
    this.isModalOpen = false;
    this.error = null;
  }
}
