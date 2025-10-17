import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminContactUsService, ContactUsItem, ContactUsResponse } from './services/admin-contact-us.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-contact-us',
  imports: [CommonModule, TranslateModule, LoadingSpinner],
  templateUrl: './admin-contact-us.html',
  styleUrl: './admin-contact-us.scss'
})
export class AdminContactUs implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  contactUsData: ContactUsItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminContactUsService: AdminContactUsService) {}

  ngOnInit(): void {
    this.loadContactUsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadContactUsData(): void {
    this.loading = true;
    this.error = null;

    this.adminContactUsService.getContactUs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ContactUsResponse) => {
          this.contactUsData = response.allContactUs.data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'فشل في تحميل رسائل التواصل. يرجى المحاولة مرة أخرى.';
          this.loading = false;
          console.error('خطأ في تحميل بيانات التواصل:', error);
        }
      });
  }

  onRefresh(): void {
    this.loadContactUsData();
  }

  trackByContactId(index: number, contact: ContactUsItem): string {
    return contact._id;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory'
    });
  }
}
