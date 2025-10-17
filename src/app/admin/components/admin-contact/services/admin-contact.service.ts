// This service is responsible for handling contact-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ContactItem {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ContactsData {
  data: ContactItem[];
  seeMore: boolean;
}

export interface ContactResponse {
  message: string;
  Contacts: ContactsData;
}

@Injectable({
  providedIn: 'root',
})
export class AdminContactService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Access ${token}` }),
    });
  }

  // Get token from storage
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get all contacts
  getContacts(): Observable<ContactResponse> {
    const url = `${this.apiUrl}/admin/contact`;
    console.log('AdminContactService: Making request to:', url);

    return this.http.get<ContactResponse>(url, {
      headers: this.getAuthHeaders(),
    });
  }
}