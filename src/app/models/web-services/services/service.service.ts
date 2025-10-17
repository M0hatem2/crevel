import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import {
  ServicesResponse,
  ServiceItem,
  PortfolioResponse,
  PortfolioItem,
  SpecificServiceResponse,
} from '../interfaces/service.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private apiService: ApiService) {}

  // Get all services with Arabic language
  getServices(): Observable<ServicesResponse> {
    return this.apiService.get<ServicesResponse>('service/services?lang=ar');
  }

  // Get portfolio details by ID (for services-details page)
  getPortfolioDetails(portfolioId: string): Observable<PortfolioResponse> {
    // Use the correct API endpoint format that matches your example
    return this.apiService.get<PortfolioResponse>(`portfolio/${portfolioId}`);
  }

  // Get single service by ID
  getServiceById(serviceId: string): Observable<ServicesResponse> {
    return this.apiService.get<ServicesResponse>(`service/services/${serviceId}?lang=ar`);
  }

  // Alternative method to get portfolio by the specific ID from your example
  getPortfolioByExampleId(): Observable<PortfolioResponse> {
    const exampleId = '68d74d9a57a8d9d59284c706';
    return this.apiService.get<PortfolioResponse>(`portfolio/${exampleId}`);
  }

  // Get specific service data using the provided endpoint
  getSpecificService(): Observable<SpecificServiceResponse> {
    return this.apiService.get<SpecificServiceResponse>('service/de058a1e160bbe05838c2b?lang=ar');
  }
}
