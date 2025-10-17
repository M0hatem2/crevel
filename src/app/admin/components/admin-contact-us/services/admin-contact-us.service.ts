// This service is responsible for handling contact us operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface ContactUsItem {
  _id: string;
  name: string;
  name2: string;
  service: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AllContactUsData {
  data: ContactUsItem[];
  seeMore: boolean;
}

export interface ContactUsResponse {
  message: string;
  allContactUs: AllContactUsData;
}

@Injectable({
  providedIn: 'root',
})
export class AdminContactUsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ GET contact us messages
  getContactUs(): Observable<ContactUsResponse> {
    const url = `${this.apiUrl}/admin/contactUs`;
    console.log('AdminContactUsService: Making request to:', url);

    return this.http
      .get<ContactUsResponse>(url+`?seeMore=true`, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminContactUsService: Response received:', response);
        }),
        catchError((error) => {
          console.error('AdminContactUsService: Error occurred:', error);
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