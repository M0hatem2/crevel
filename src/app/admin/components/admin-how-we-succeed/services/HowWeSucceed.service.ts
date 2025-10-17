// This service is responsible for handling "How We Succeed" related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HowWeSucceedService {
  private apiUrl = `${environment.apiUrl}/admin/howWeSucceed`;

  constructor(private http: HttpClient) {}

  // ✅ GET all how we succeed items
  getHowWeSucceedItems(): Observable<any[]> {
    console.log('HowWeSucceedService: Getting all items from:', this.apiUrl);

    return this.http
      .get<any>(this.apiUrl, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('HowWeSucceedService: Response received:', response);
        }),
        map((response) => {
          // Handle the actual response format: { message, howWeSucceed: { data: [], seeMore: boolean } }
          let items: any[] = [];
          if (response && response.howWeSucceed && response.howWeSucceed.data && Array.isArray(response.howWeSucceed.data)) {
            items = response.howWeSucceed.data;
          } else if (response && response.howWeSucceed && Array.isArray(response.howWeSucceed)) {
            items = response.howWeSucceed;
          } else if (Array.isArray(response)) {
            items = response;
          }
          return items;
        }),
        catchError((error) => {
          console.error('HowWeSucceedService: Error occurred:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ POST add new how we succeed item
  addHowWeSucceedItem(data: { title_en: string; title_ar: string; description_en: string; description_ar: string }): Observable<any> {
    console.log('HowWeSucceedService: Adding new item');

    return this.http
      .post<any>(this.apiUrl, data, {
        headers: new HttpHeaders({ ...this.getAuthHeaders(), 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response) => {
          console.log('HowWeSucceedService: Add response:', response);
        }),
        catchError((error) => {
          console.error('HowWeSucceedService: Add error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH update how we succeed item
  updateHowWeSucceedItem(id: string, data: { title_en: string; title_ar: string; description_en: string; description_ar: string }): Observable<any> {
    console.log('HowWeSucceedService: Updating item:', id);

    return this.http
      .patch<any>(`${this.apiUrl}/${id}`, data, {
        headers: new HttpHeaders({ ...this.getAuthHeaders(), 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response) => {
          console.log('HowWeSucceedService: Update response:', response);
        }),
        catchError((error) => {
          console.error('HowWeSucceedService: Update error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ DELETE how we succeed item
  deleteHowWeSucceedItem(id: string, reason?: string): Observable<any> {
    console.log('HowWeSucceedService: Deleting item:', id);

    const body = reason ? { reason } : {};

    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, {
        headers: new HttpHeaders({ ...this.getAuthHeaders(), 'Content-Type': 'application/json' }),
        body: body
      })
      .pipe(
        tap((response) => {
          console.log('HowWeSucceedService: Delete response:', response);
        }),
        catchError((error) => {
          console.error('HowWeSucceedService: Delete error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ Auth Headers helper
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Access ${token}` } : {};
  }
}
