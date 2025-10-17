// This service is responsible for handling briefs-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminBriefsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ GET briefs
  getBriefs(): Observable<any> {
    const url = `${this.apiUrl}/admin/brief?seeMore=true`;
    console.log('AdminBriefsService: Making request to:', url);

    return this.http
      .get<any>(url, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminBriefsService: Response received:', response);
        }),
        catchError((error) => {
          console.error('AdminBriefsService: Error occurred:', error);
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