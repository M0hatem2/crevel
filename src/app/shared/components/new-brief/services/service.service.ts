import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewBriefService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // POST new brief request
  createNewBrief(data: {
    projectName: string;
    description: string;
    email: string;
    mobileNumber: string;
    budget: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/request/brief`, data);
  }
}
