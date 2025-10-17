import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-services-header',
  imports: [TranslateModule , RouterLink],
  templateUrl: './services-header.html',
  styleUrl: './services-header.scss',
})
export class ServicesHeader {
  constructor(private router: Router, private translate: TranslateService) {}

  scrollToServices(): void {
    // Try to find services section on current page first
    const servicesSection =
      document.getElementById('services-section') ||
       document.querySelector('.services-section') ||
      document.querySelector('#services');

    if (servicesSection) {
      // Smooth scroll to services section on same page
      servicesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // Navigate to services page if section not found on current page
     }
  }

  navigateToCoreServices(): void {
    // Navigate to services page and scroll to core services section smoothly
    this.router.navigate(['/services']).then(() => {
      // Wait a bit for the page to load, then scroll to core services section
      setTimeout(() => {
        const coreServicesSection = document.querySelector('.core-services-section');
        if (coreServicesSection) {
          // Add a highlight effect before scrolling
          coreServicesSection.classList.add('highlight-section');

          // Smooth scroll to the section
          coreServicesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Remove highlight after animation completes
          setTimeout(() => {
            coreServicesSection.classList.remove('highlight-section');
          }, 2000);
        }
      }, 300); // Wait 300ms for page transition
    });
  }
}
