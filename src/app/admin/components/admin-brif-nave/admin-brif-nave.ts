import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {
  AdminBrifNaveService,
  NewBriefItem,
  NewBriefsResponse,
  NewBriefsFilters,
} from './services/admin-brif-nave.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-brif-nave',
  imports: [CommonModule, TranslateModule, LoadingSpinner],
  templateUrl: './admin-brif-nave.html',
  styleUrl: './admin-brif-nave.scss',
})
export class AdminBrifNave implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  newBriefs: NewBriefItem[] = [];
  loading = false;
  error: string | null = null;
  filters: NewBriefsFilters = {};
  hasMore = false;

  constructor(private adminBrifNaveService: AdminBrifNaveService) {}

  ngOnInit(): void {
    this.loadNewBriefs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNewBriefs(): void {
    this.loading = true;
    this.error = null;

    this.adminBrifNaveService
      .getNewBriefs(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: NewBriefsResponse) => {
          this.newBriefs = response.newBriefs.data;
          this.hasMore = response.newBriefs.seeMore;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'فشل في تحميل النبذات الجديدة. يرجى المحاولة مرة أخرى.';
          this.loading = false;
          console.error('خطأ في تحميل بيانات النبذات الجديدة:', error);
        },
      });
  }

  onRefresh(): void {
    this.loadNewBriefs();
  }

  trackByBriefId(index: number, brief: NewBriefItem): string {
    return brief._id;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      calendar: 'gregory',
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  }
}
