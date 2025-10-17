import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminMeetingsService } from './services/admin-meetings.service';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-meetings',
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './admin-meetings.html',
  styleUrl: './admin-meetings.scss'
})
export class AdminMeetings implements OnInit {
   meetings: any[] = [];
   newMeetings: any[] = [];
   filteredMeetings: any[] = [];
   loading = false;
   error: string | null = null;
   activeTab = 'all';
   selectedDateFilter = 'all';

   dateFilterOptions = [
     { value: 'all', label: 'All Time', labelAr: 'كل الأوقات' },
     { value: 'today', label: 'Today', labelAr: 'اليوم' },
     { value: 'yesterday', label: 'Yesterday', labelAr: 'بالأمس' },
     { value: 'currentWeek', label: 'Current Week', labelAr: 'الأسبوع الحالي' },
     { value: 'lastWeek', label: 'Last Week', labelAr: 'الأسبوع الماضي' },
     { value: 'currentMonth', label: 'Current Month', labelAr: 'الشهر الحالي' },
     { value: 'lastMonth', label: 'Last Month', labelAr: 'الشهر الماضي' },
     { value: 'currentYear', label: 'Current Year', labelAr: 'السنة الحالية' },
     { value: 'lastYear', label: 'Last Year', labelAr: 'السنة السابقة' }
   ];

   constructor(private adminMeetingsService: AdminMeetingsService) {}

  ngOnInit(): void {
    this.loadMeetings();
    this.loadNewMeetings();
  }

  loadMeetings(): void {
    this.loading = true;
    this.error = null;

    this.adminMeetingsService.getMeetings().subscribe({
      next: (response) => {
        // Handle the nested response structure: response.meetings.data
        this.meetings = response.meetings?.data || [];
        this.applyDateFilter(); // Apply filter after loading data
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load meetings';
        this.loading = false;
        console.error('Error loading meetings:', error);
      }
    });
  }

  loadNewMeetings(): void {
    this.loading = true;
    this.error = null;

    this.adminMeetingsService.getNewMeetings().subscribe({
      next: (response) => {
        // Handle the nested response structure: response.meetings.data
        this.newMeetings = response.meetings?.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load new meetings';
        this.loading = false;
        console.error('Error loading new meetings:', error);
      }
    });
  }

  refreshData(): void {
    this.loadMeetings();
    this.loadNewMeetings();
  }

  getDateRange(filter: string): { start: Date; end: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };

      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return { start: yesterday, end: today };

      case 'currentWeek':
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 7);
        return { start: currentWeekStart, end: currentWeekEnd };

      case 'lastWeek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7);
        return { start: lastWeekStart, end: lastWeekEnd };

      case 'currentMonth':
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return { start: currentMonthStart, end: currentMonthEnd };

      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: lastMonthStart, end: lastMonthEnd };

      case 'currentYear':
        const currentYearStart = new Date(today.getFullYear(), 0, 1);
        const currentYearEnd = new Date(today.getFullYear() + 1, 0, 1);
        return { start: currentYearStart, end: currentYearEnd };

      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear(), 0, 1);
        return { start: lastYearStart, end: lastYearEnd };

      default:
        return { start: new Date(0), end: new Date() };
    }
  }

  applyDateFilter(): void {
    if (this.selectedDateFilter === 'all') {
      this.filteredMeetings = [...this.meetings];
    } else {
      const { start, end } = this.getDateRange(this.selectedDateFilter);

      this.filteredMeetings = this.meetings.filter(meeting => {
        const meetingDate = new Date(meeting.createdAt);
        return meetingDate >= start && meetingDate < end;
      });
    }
  }

  onDateFilterChange(): void {
    this.applyDateFilter();
  }
}