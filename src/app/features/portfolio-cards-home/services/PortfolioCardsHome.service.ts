import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PortfolioResponse } from '../../../models/portfolio';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPortfolio(): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.apiUrl}/portfolio?seeMore=true`);
  }

  getPortfolioById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/portfolio/${id}`);
  }
}
