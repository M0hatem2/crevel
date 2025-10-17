// This service is responsible for handling about-us-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminAboutUsService {
  private apiUrl = `${environment.apiUrl}/admin/aboutUs`;

  constructor(private http: HttpClient) {}

  // ✅ GET about us
  getAboutUs(): Observable<any> {
    console.log('AdminAboutUsService: Making request to:', this.apiUrl);
    console.log('AdminAboutUsService: With headers:', this.getAuthHeaders());

    return this.http
      .get<any>(this.apiUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log('AdminAboutUsService: Response received:', response);
        }),
        map((response) => response.data || response), // Handle wrapped or direct responses
        catchError((error) => {
          console.error('AdminAboutUsService: Error occurred:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH edit about us (or create if no ID)
  editAboutUs(id: string, aboutUs: any): Observable<any> {
    console.log('AdminAboutUsService: Saving about us:', id || 'new', aboutUs);
    return this.http
      .patch<any>(this.apiUrl, aboutUs, {
        headers: this.getHeaders(aboutUs),
      })
      .pipe(
        tap((response) => {
          console.log('AdminAboutUsService: Save about us response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminAboutUsService: Save about us error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH edit about us (partial update)
  patchAboutUs(id: string, aboutUs: any): Observable<any> {
    console.log('AdminAboutUsService: PATCH editing about us:', id, aboutUs);
    return this.http
      .patch<any>(`${this.apiUrl}/${id}`, aboutUs, {
        headers: this.getHeaders(aboutUs),
      })
      .pipe(
        tap((response) => {
          console.log('AdminAboutUsService: PATCH edit about us response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminAboutUsService: PATCH edit about us error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ Headers helper
  private getHeaders(data?: any): HttpHeaders {
    let headers = new HttpHeaders(this.getAuthHeaders());
    if (!(data instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  // ✅ Auth Headers helper
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Access ${token}` } : {};
  }
}
