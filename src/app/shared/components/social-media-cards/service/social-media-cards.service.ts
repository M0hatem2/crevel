import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PortfolioItem } from '../../../../../app/models/portfolio';

export type { PortfolioItem } from '../../../../../app/models/portfolio';
export interface Image {
  public_id: string;
  secure_url: string;
}

export interface PortfolioResponse {
  message: string;
  data: {
    data: PortfolioItem[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class SocialMediaCardsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPortfolio(): Observable<PortfolioResponse> {
    const lang = localStorage.getItem('language') || 'ar';
    const url = `${this.baseUrl}/portfolio`+`?lang=${lang}&seeMore=true`;
    return this.http.get<PortfolioResponse>(url);
  }

  getPortfolioById(id: string): Observable<PortfolioItem> {
    const url = `${this.baseUrl}/portfolio/${id}`;
    return this.http.get<PortfolioItem>(url);
  }
}

