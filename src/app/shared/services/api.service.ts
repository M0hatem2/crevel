import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private languageService: LanguageService) {}

  // Helper method to get headers with Accept-Language
  private getHeaders(): any {
    const currentLang = this.languageService.currentLanguage;
    return {
      'Accept-Language': currentLang
    };
  }

  // Generic GET request
  get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers }).pipe(catchError(this.handleError));
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, { headers }).pipe(catchError(this.handleError));
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers }).pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  getServices(): Observable<any> {
    return this.get<any>('service/services');
  }
}
