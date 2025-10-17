import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LanguageService } from '../../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private baseUrl = environment.apiUrl; // ✅ استخدم الـ environment الصح

  constructor(private http: HttpClient, private languageService: LanguageService) {}

  // ✅ Get all services
  getServices(): Observable<any> {
    const currentLang = this.languageService.currentLanguage;
    return this.http.get<any>(`${this.baseUrl}/service/services/?seeMore=true&lang=${currentLang}`);
  }

  // ✅ Get service by ID
  getServiceById(serviceId: string): Observable<any> {
    const currentLang = this.languageService.currentLanguage;
    return this.http.get<any>(`${this.baseUrl}/service/services/${serviceId}?lang=${currentLang}`);
  }

  // ✅ Get service by ID with language parameter
  getServiceByIdWithLang(serviceId: string): Observable<any> {
    const currentLang = this.languageService.currentLanguage;
    return this.http.get<any>(`${this.baseUrl}/service/${serviceId}?lang=${currentLang}`);
  }

  // ✅ Get portfolio by ID
  getPortfolioById(portfolioId: string): Observable<any> {
    const currentLang = this.languageService.currentLanguage;
    return this.http.get<any>(`${this.baseUrl}/portfolio/${portfolioId}?lang=${currentLang}`);
  }
}
