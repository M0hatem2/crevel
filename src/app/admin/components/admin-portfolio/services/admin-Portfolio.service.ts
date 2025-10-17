// This service is responsible for handling portfolio-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { PortfolioResponse, PortfolioItem } from '../../../../models/portfolio';

@Injectable({
  providedIn: 'root',
})
export class AdminPortfolioService {
  private apiUrl = `${environment.apiUrl}/admin/portfolio?seeMore=true`;

  constructor(private http: HttpClient) {}

  // ✅ GET all portfolio items
  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.http
      .get<any>(this.apiUrl, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        map((response) =>
          response.projects.data.map((item: PortfolioItem) => ({
            ...item,
            imageUrl: item.image ? item.image.secure_url : null,
          }))
        )
      );
  }

  // ✅ POST - add new item
  addPortfolioItem(portfolioData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, portfolioData, {
      headers: new HttpHeaders({
        ...this.getAuthHeaders(),
      }),
    });
  }

  // ✅ PATCH - update item
  updatePortfolioItem(id: string, portfolioData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, portfolioData, {
      headers: new HttpHeaders({
        ...this.getAuthHeaders(),
        // Do not set Content-Type for FormData, let the browser set it with boundary
      }),
    });
  }

  // ✅ DELETE - remove item
  deletePortfolioItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders(this.getAuthHeaders()),
      body: { reason: 'Deleted by admin' },
    });
  }

  // ✅ GET categories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/categories`, {
      headers: new HttpHeaders(this.getAuthHeaders()),
    });
  }

  // ✅ GET blocked users
  getBlockedUsers(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/user?isBlocked=true`, {
      headers: new HttpHeaders(this.getAuthHeaders()),
    });
  }

  // ✅ GET unblocked users
  getUnblockedUsers(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/user?isBlocked=false`, {
      headers: new HttpHeaders(this.getAuthHeaders()),
    });
  }

  // ✅ POST - confirm user
  confirmUser(id: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/admin/user/confirm/${id}`,
      {
        reason: 'accept',
      },
      {
        headers: new HttpHeaders(this.getAuthHeaders()),
      }
    );
  }

  // ✅ POST - block user
  blockUser(id: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/admin/user/block/${id}`,
      {},
      {
        headers: new HttpHeaders(this.getAuthHeaders()),
      }
    );
  }

  // ✅ POST - unblock user
  unblockUser(id: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/admin/user/unblock/${id}`,
      {},
      {
        headers: new HttpHeaders(this.getAuthHeaders()),
      }
    );
  }

  // ✅ Auth Headers helper
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Access ${token}` } : {};
  }
}
