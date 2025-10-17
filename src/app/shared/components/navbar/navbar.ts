import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutService } from '../../../core/layouts/layout.service';
import { LayoutType } from '../../../core/layouts/layout.model';
import { RequestContact } from '../request-contact/request-contact';
import { ScheduleMeeting } from '../schedule-meeting/schedule-meeting';
import { NewBrief } from '../new-brief/new-brief';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { LanguageService } from '../../../core/services/language.service';
import { FooterService, FooterResponse, FooterData } from '../footer/services/footer.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLinkActive,
    CommonModule,
    RouterLink,
    RequestContact,
    ScheduleMeeting,
    NewBrief,
    LanguageToggleComponent,
    TranslateModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  isVisible = false;
  layout: string = 'user'; // Default to user layout, can be changed to 'admin'
  isMenuOpen = false;
  isDropdownOpen = false;
  isAuthDropdownOpen = false;
  activeModal = '';
  isRTL = false;
  isMobileView = false;
  showNavbar = true;
  footerResponse: FooterResponse | null = null;
  footerData: FooterData | null = null;
  private layoutSubscription: Subscription = new Subscription();
  private languageSubscription: Subscription = new Subscription();

  constructor(
    private layoutService: LayoutService,
    private languageService: LanguageService,
    private router: Router,
    private footerService: FooterService
  ) {
    {
      this.router.events.subscribe(() => {
        this.showNavbar =
          this.router.url.includes('admin/home') ||
           this.router.url.includes('admin/portfolio') ||
          this.router.url.includes('admin/brief') ||
          this.router.url.includes('admin/about') ||
          this.router.url.includes('admin/contact') ||
          this.router.url.includes('admin/services') ||
          this.router.url.includes('admin/blog') ||
          this.router.url.includes('admin/users') ||
          this.router.url.includes('admin/settings') ||
          this.router.url.includes('admin/footer') ||
          this.router.url.includes('admin/meetings') ||
          this.router.url.includes('admin/new-briefs') ||
          this.router.url.includes('admin/how-we-succeed') ||
          this.router.url.includes('admin/profile') 
          ;
      });
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isVisible = window.scrollY > 300;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const newRequestDropdownButton = target.closest('[data-dropdown-toggle="newRequestDropdown"]');
    const newRequestDropdownMenu = target.closest('.mobile-dropdown-menu');
    const newRequestDropdownBackdrop = target.closest('.fixed.inset-0.bg-black.bg-opacity-50');

    const authDropdownButton = target.closest('[data-dropdown-toggle="authDropdown"]');
    const authDropdownMenu = target.closest('.auth-dropdown');
    const authDropdownBackdrop = target.closest(
      '.auth-dropdown + .fixed.inset-0.bg-black.bg-opacity-50'
    );

    // Close dropdown if clicking outside both button and menu, or on backdrop
    if (!newRequestDropdownButton && !newRequestDropdownMenu && !newRequestDropdownBackdrop) {
      this.isDropdownOpen = false;
    }

    if (!authDropdownButton && !authDropdownMenu && !authDropdownBackdrop) {
      this.isAuthDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeModal();
    this.isDropdownOpen = false;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
  }

  closeModal() {
    this.activeModal = '';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleAuthDropdown() {
    this.isAuthDropdownOpen = !this.isAuthDropdownOpen;
    // Close other dropdowns when opening auth dropdown
    this.isDropdownOpen = false;
  }

  openModal(type: string) {
    this.activeModal = type;
    this.isDropdownOpen = false; // Close dropdown when opening modal
  }

  navigateToAuth(route: string) {
    this.closeAllDropdowns();
    this.router.navigate([route]);
  }

  closeAllDropdowns() {
    this.isAuthDropdownOpen = false;
    this.isDropdownOpen = false;
  }

  onModalClick(event: Event) {
    event.stopPropagation(); // Prevent modal click from closing itself
  }

  onBackdropClick(event: Event) {
    // Only close modal if clicking directly on the backdrop, not on modal content
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  checkRTL() {
    // Check if current language is RTL (Arabic)
    const currentLang = this.languageService.currentLanguage;
    this.isRTL = currentLang === 'ar';
  }

  checkMobileView() {
    // Check if screen width is mobile size (768px and below for md breakpoint)
    this.isMobileView = window.innerWidth <= 768;
  }

  ngOnInit() {
    // Subscribe to layout changes
    this.layoutSubscription = this.layoutService.layout$.subscribe((layout: LayoutType) => {
      this.layout = layout;
    });

    // Subscribe to language changes
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      this.checkRTL();
    });

    // Load footer data for logo
    this.loadFooterData();

    // Initialize RTL and mobile view detection
    this.checkRTL();
    this.checkMobileView();
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.layoutSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

  loadFooterData() {
    // Load footer data for logo
    this.footerService.getFooterData().subscribe({
      next: (response: FooterResponse) => {
        this.footerResponse = response;
        this.footerData = response.footer;
        console.log('✅ Navbar footer data loaded successfully:', this.footerData);
      },
      error: (error: any) => {
        console.error('❌ Failed to load footer data for navbar:', error);
        // Continue without footer data - logo will fallback to static path
      },
    });
  }

  getTranslation(key: string): string {
    const translation = this.languageService.getTranslationSync(key);
    return translation;
  }

  getModalTitle(): string {
    switch (this.activeModal) {
      case 'request':
        return 'Request Contact';
      case 'meeting':
        return 'Schedule Meeting';
      case 'submit':
        return 'Submit New Brief';
      default:
        return 'Contact Us';
    }
  }
}
