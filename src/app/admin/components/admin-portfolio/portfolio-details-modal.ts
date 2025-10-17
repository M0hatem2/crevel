import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioItem } from '../../../models/portfolio';

@Component({
  selector: 'app-portfolio-details-modal',
  imports: [CommonModule],
  templateUrl: './portfolio-details-modal.html',
  styleUrl: './portfolio-details-modal.scss',
})
export class PortfolioDetailsModal implements OnInit {
  @Input() isOpen = false;
  @Input() selectedItem: PortfolioItem | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<PortfolioItem>();
  @Output() delete = new EventEmitter<string>();
  @Output() refreshList = new EventEmitter<void>();

  showImageModal = false;
  selectedImageUrl = '';

  ngOnInit(): void {
    // Add body scroll lock when modal is open
    if (typeof document !== 'undefined') {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
  }

  ngOnDestroy(): void {
    // Restore body scroll when component is destroyed
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  }

  editProject(): void {
    if (this.selectedItem) {
      this.edit.emit(this.selectedItem);
      this.closeModal();
    }
  }

  confirmDelete(): void {
    if (this.selectedItem?._id) {
      const confirmed = confirm(
        'Are you sure you want to delete this portfolio item? This action cannot be undone.'
      );
      if (confirmed) {
        this.delete.emit(this.selectedItem._id);
      }
    }
  }

  openImageModal(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImageUrl = '';
  }

  hasGalleryImages(): boolean {
    return !!(this.selectedItem?.gallery && this.selectedItem.gallery.length > 0);
  }

  // Handle escape key
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
