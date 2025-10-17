import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BriefRequest, BriefResponse } from '../../../models/brife/brife';

@Injectable({
  providedIn: 'root',
})
export class TalkService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new brief request
   */
  createBrief(briefData: BriefRequest): Observable<BriefResponse> {
    return this.http
      .post<BriefResponse>(`${this.baseUrl}/request/brief`, briefData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error (Code: ${error.status}): ${
        error.error?.message || error.message
      }`;
    }

    console.error('API Error:', errorMessage);
    console.error('Full error object:', error);
    return throwError(() => new Error(errorMessage));
  }
}
