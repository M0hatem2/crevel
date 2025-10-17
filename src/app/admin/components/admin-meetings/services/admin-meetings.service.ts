// This service is responsible for handling meetings-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminMeetingsService {
  private apiUrl = `${environment.apiUrl}/admin/meeting`;

  constructor(private http: HttpClient) {}

  // ✅ GET meetings
  getMeetings(): Observable<any> {
    const url = `${this.apiUrl}?seeMore=true`;
    console.log('AdminMeetingsService: Making request to:', url);

    return this.http
      .get<any>(url, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminMeetingsService: Response received:', response);
        }),
        catchError((error) => {
          console.error('AdminMeetingsService: Error occurred:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ GET new meetings
  getNewMeetings(): Observable<any> {
    console.log('AdminMeetingsService: Making request to:', this.apiUrl);

    return this.http
      .get<any>(this.apiUrl, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminMeetingsService: New meetings response received:', response);
        }),
        catchError((error) => {
          console.error('AdminMeetingsService: Error occurred:', error);
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