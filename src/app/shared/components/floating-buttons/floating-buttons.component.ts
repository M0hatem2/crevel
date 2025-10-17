import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonsService } from '../../services/floating-buttons.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- زر لأعلى وواتساب -->
    <div class="fixed bottom-10 right-6 flex flex-col items-center gap-3 z-50" *ngIf="shouldShowButtons">
      <button (click)="scrollToTop()"
        class="bg-[#057373] text-white p-3 rounded-md shadow-md hover:bg-[#0a8f8b] transition w-10 h-10 flex items-center justify-center"
        *ngIf="isVisible" aria-label="Scroll to top">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
      <a href="https://wa.me/201234567890" target="_blank"
        class="bg-[#057373] text-white p-3 rounded-md shadow-md hover:bg-green-600 transition w-10 h-10 flex items-center justify-center">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FloatingButtonsComponent implements OnInit, OnDestroy {
  isVisible = false;
  shouldShowButtons = true;
  private subscription: Subscription = new Subscription();

  constructor(private floatingButtonsService: FloatingButtonsService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.floatingButtonsService.shouldShowButtons$.subscribe(
        shouldShow => this.shouldShowButtons = shouldShow
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.shouldShowButtons) return;

    this.isVisible = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}