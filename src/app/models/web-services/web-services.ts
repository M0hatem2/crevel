import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceService } from './services/service.service';
import { ServiceItem } from './interfaces/service.interface';
import { ServicesHeader } from '../../features/services-header/services-header';
import { CoreServices } from "../../features/core-services/core-services";
import { TrustedServices } from "../../features/trusted-services/trusted-services";

@Component({
  selector: 'app-web-services',
  imports: [CommonModule, ServicesHeader, CoreServices, TrustedServices],
  templateUrl: './web-services.html',
  styleUrl: './web-services.scss'
})
export class WebServices implements OnInit {
  services: ServiceItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;

    this.serviceService.getServices().subscribe({
      next: (response) => {
        this.services = response.data.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load services. Please try again later.';
        this.loading = false;
        console.error('Error loading services:', error);
      }
    });
  }

  onServiceClick(service: ServiceItem): void {
    this.router.navigate(['/services', service._id]);
  }

  trackByServiceId(index: number, service: ServiceItem): string {
    return service._id;
  }
}
