import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface NewBriefItem {
  _id: string;
  projectName: string;
  description: string;
  email: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NewBriefsData {
  data: NewBriefItem[];
  seeMore: boolean;
}

export interface NewBriefsResponse {
  message: string;
  newBriefs: NewBriefsData;
}

export interface NewBriefsFilters {
  id?: string;
  email?: string;
  projectName?: string;
  budget?: number;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  seeMore?: boolean;
  sort?: string;
  select?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminBrifNaveService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getNewBriefs(filters?: NewBriefsFilters): Observable<NewBriefsResponse> {
    const url = `${this.apiUrl}/admin/newBrief`;
    console.log('AdminBrifNaveService: Making request to:', url);

    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof NewBriefsFilters] !== undefined) {
          params = params.set(key, filters[key as keyof NewBriefsFilters] as string);
        }
      });
    }

    return this.http
      .get<NewBriefsResponse>(url, {
        headers: new HttpHeaders(this.getAuthHeaders()),
        params
      })
      .pipe(
        tap((response) => {
          console.log('AdminBrifNaveService: Response received:', response);
        }),
        catchError((error) => {
          console.error('AdminBrifNaveService: Error occurred:', error);
          return throwError(() => error);
        })
      );
  }

  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Access ${token}` } : {};
  }
}