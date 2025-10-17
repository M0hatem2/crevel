import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PortfolioItem, PortfolioResponse } from '../../../../models/portfolio';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPortfolioItems(lang: string = 'ar', seeMore: boolean = true): Observable<PortfolioItem[]> {
    let params = new HttpParams()
      .set('lang', lang)
      .set('seeMore', seeMore.toString());

    return this.http.get<PortfolioResponse>(`${this.apiUrl}/portfolio`, { params })
      .pipe(
        map(response => response.data.data)
      );
  }

  getPortfolioById(id: string): Observable<PortfolioItem> {
    return this.http.get<PortfolioItem>(`${this.apiUrl}/portfolio/${id}`);
  }
}
