import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PortfolioResponse } from '../../../models/portfolio';
import { LanguageService } from '../../../core/services/language.service';
 
@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
   private apiUrl = environment.apiUrl;

   constructor(private http: HttpClient, private languageService: LanguageService) {}

  getPortfolio(): Observable<PortfolioResponse> {
    const params = new HttpParams().set('lang', this.languageService.currentLanguage);
    return this.http.get<PortfolioResponse>(`${this.apiUrl}/portfolio?seeMore=true`, { params });
  }
}
