import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LanguageToggleComponent } from '../../../shared/components/language-toggle/language-toggle.component';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslateModule,
    CommonModule,
    LanguageToggleComponent,
  ],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.scss',
})
export class AdminHome implements OnInit, OnDestroy {
  // Notification properties
  notifications: any[] = [];
  unreadCount: number = 0;
  baseURL: string = '';
  isNotificationsOpen: boolean = false;
  hasMoreNotifications: boolean = false;

  // Modal properties
  isModalOpen: boolean = false;
  selectedNotification: any = null;

  // RTL support properties
  isRTL: boolean = false;
  currentLanguage: string = 'en';
  private languageSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private languageService: LanguageService
  ) {
    this.baseURL = environment.apiUrl || '';
  }

  ngOnInit() {
    this.initializeSidebarToggle();
    this.initializeDropdowns();
    this.loadNotifications();
    this.initializeRTLSupport();
  }

  ngOnDestroy() {
    this.languageSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private initializeRTLSupport() {
    // Check if current language is RTL (Arabic)
    this.checkRTL();

    // Subscribe to language changes
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      this.checkRTL();
    });
  }

  private checkRTL() {
    // Check if current language is RTL (Arabic)
    const currentLang = this.languageService.currentLanguage;
    this.isRTL = currentLang === 'ar';
    this.currentLanguage = currentLang;
  }

  private initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLElement;
    const sidebar = document.getElementById('logo-sidebar') as HTMLElement;

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
      });
    }
  }

  private initializeDropdowns() {
    // Initialize user dropdown functionality
    const userDropdown = document.getElementById('dropdown-user');
    const userButton = document.querySelector(
      '[data-dropdown-toggle="dropdown-user"]'
    ) as HTMLElement;

    if (userButton && userDropdown) {
      userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');

        // Close notifications dropdown if open
        const notificationsDropdown = document.getElementById('notifications-dropdown');
        if (notificationsDropdown && !notificationsDropdown.classList.contains('hidden')) {
          notificationsDropdown.classList.add('hidden');
          this.isNotificationsOpen = false;
        }
      });
    }

    // Initialize notifications dropdown functionality
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    const notificationsButton = document.getElementById('notifications-button');

    if (notificationsButton && notificationsDropdown) {
      notificationsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // Toggle handled by toggleNotifications() method
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      // Close user dropdown
      if (userButton && userDropdown) {
        if (!userButton.contains(e.target as Node) && !userDropdown.contains(e.target as Node)) {
          userDropdown.classList.add('hidden');
        }
      }

      // Close notifications dropdown
      if (notificationsButton && notificationsDropdown) {
        if (
          !notificationsButton.contains(e.target as Node) &&
          !notificationsDropdown.contains(e.target as Node)
        ) {
          notificationsDropdown.classList.add('hidden');
          this.isNotificationsOpen = false;
        }
      }
    });
  }

  // Notification methods
  loadNotifications() {
    const token = this.authService.getToken();
    console.log('Auth token:', token ? 'Token exists' : 'No token');
    console.log('Base URL:', this.baseURL);

    if (!token) {
      console.log('No token found, returning early');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Access ${token}`,
      'Accept-Language': 'en', // You can get this from your translation service
    });

    console.log('Making API request to:', `${this.baseURL}/admin/notifications?seeMore=true`);

    this.http.get(`${this.baseURL}/admin/notifications?seeMore=true`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response.notifications.data);
        this.notifications = response.notifications.data;

        this.unreadCount = response.unreadCount || 0;
        this.hasMoreNotifications = response.seeMore || false;
        console.log('Final notifications array:', this.notifications);
        console.log('Unread count:', this.unreadCount);
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.notifications = [];
        this.unreadCount = 0;
      },
    });
  }

  toggleNotifications() {
    const dropdown = document.getElementById('notifications-dropdown');
    const button = document.getElementById('notifications-button');

    console.log('Toggle notifications called');
    console.log('Dropdown element:', dropdown);
    console.log('Button element:', button);

    if (dropdown && button) {
      const isCurrentlyHidden = dropdown.classList.contains('hidden');
      console.log('Dropdown currently hidden:', isCurrentlyHidden);

      this.isNotificationsOpen = !this.isNotificationsOpen;
      dropdown.classList.toggle('hidden');

      console.log('New hidden state:', dropdown.classList.contains('hidden'));
      console.log('isNotificationsOpen:', this.isNotificationsOpen);

      // Close user dropdown if open
      const userDropdown = document.getElementById('dropdown-user');
      if (userDropdown && !userDropdown.classList.contains('hidden')) {
        userDropdown.classList.add('hidden');
      }
    } else {
      console.error('Dropdown or button element not found');
    }
  }

  markAsRead(notificationId: string) {
    const token = this.authService.getToken();
    if (!token) return;

    // Find the notification to get its targetId
    const notification = this.notifications.find((n) => n._id === notificationId);
    const targetId = notification?.targetId || notificationId;

    const headers = new HttpHeaders({
      Authorization: `Access ${token}`,
      'Accept-Language': 'en',
      targetId: targetId,
    });

    this.http
      .patch(`${this.baseURL}/admin/notifications/${notificationId}/read`, {}, { headers })
      .subscribe({
        next: (response) => {
          // Update the notification in the local array
          const notification = this.notifications.find((n) => n._id === notificationId);
          if (notification) {
            notification.read = true;
          }
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        },
      });
  }

  markAllAsRead() {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Access ${token}`,
      'Accept-Language': 'en',
    });

    this.http.patch(`${this.baseURL}/admin/notifications/read-all`, {}, { headers }).subscribe({
      next: (response) => {
        this.notifications.forEach((notification) => {
          notification.read = true;
        });
        this.unreadCount = 0;
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      },
    });
  }

  // Modal methods
  openNotificationModal(notification: any) {
    this.selectedNotification = notification;
    this.isModalOpen = true;

    // Mark as read when opening modal
    if (!notification.read) {
      this.markAsRead(notification._id);
    }

    // Add class to body to prevent scrolling
    document.body.classList.add('modal-open');
  }

  closeNotificationModal() {
    this.isModalOpen = false;
    this.selectedNotification = null;

    // Remove class from body to restore scrolling
    document.body.classList.remove('modal-open');
  }

  // Handle escape key to close modal
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.closeNotificationModal();
    }
  }
}
