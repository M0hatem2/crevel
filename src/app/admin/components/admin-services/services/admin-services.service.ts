// This service is responsible for handling service-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminServicesService {
  private apiUrl = `${environment.apiUrl}/admin/service`;

  constructor(private http: HttpClient) {}

  // ✅ GET services

  // ✅ POST add service
  addService(service: any): Observable<any> {
    console.log('AdminServicesService: Adding service:', service);
    return this.http
      .post<any>(this.apiUrl, service, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminServicesService: Add service response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminServicesService: Add service error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH edit service
  editService(id: string, service: any): Observable<any> {
    console.log('AdminServicesService: Editing service:', id, service);
    return this.http
      .patch<any>(`${this.apiUrl}/${id}`, service, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminServicesService: Edit service response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminServicesService: Edit service error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ DELETE delete service
  deleteService(id: string): Observable<any> {
    console.log('AdminServicesService: Deleting service:', id);
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, {
        headers: new HttpHeaders(this.getAuthHeaders()),
        body: { reason: 'Deleted by admin' }, // Send reason in body as server expects it
      })
      .pipe(
        tap((response) => {
          console.log('AdminServicesService: Delete service response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminServicesService: Delete service error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ Auth Headers helper
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Access ${token}` } : {};
  }
  getServices(): Observable<any> {
    console.log('AdminServicesService: Getting services');
    return this.http
      .get<any>(this.apiUrl, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminServicesService: Get services response:', response);
        }),
        catchError((error) => {
          console.error('AdminServicesService: Get services error:', error);
          return throwError(() => error);
        })
      );
  }
}
