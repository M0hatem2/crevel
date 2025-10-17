import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
export interface HowWeSucceedItem {
  _id: string;
  title_ar?: string;
  description_ar?: string;
  title_en?: string;
  description_en?: string;
}

export interface HowWeSucceedResponse {
  message: string;
  HowWeSucceed: {
    data: HowWeSucceedItem[];
    seeMore: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class howWeSucceedService {
  private baseUrl = environment.apiUrl; // ✅ استخدم الـ environment الصح

  constructor(private http: HttpClient) {}

  getHowWeSucceedData(language: string = 'ar'): Observable<HowWeSucceedResponse> {
    return this.http.get<HowWeSucceedResponse>(`${this.baseUrl}/public/howWeSucceed?lang=${language}`);
  }
}
