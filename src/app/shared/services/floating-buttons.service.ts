import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloatingButtonsService {
  private shouldShowButtons = new BehaviorSubject<boolean>(true);

  public shouldShowButtons$ = this.shouldShowButtons.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateButtonVisibility(event.url);
      });
  }

  private updateButtonVisibility(url: string): void {
    // Hide buttons on admin, login, and registration pages
    const shouldHide = url.startsWith('/admin') ||
                      url.startsWith('/auth/login') ||
                      url.startsWith('/auth/user-login') ||
                      url.startsWith('/auth/register') ||
                      url === '/auth';

    this.shouldShowButtons.next(!shouldHide);
  }
}