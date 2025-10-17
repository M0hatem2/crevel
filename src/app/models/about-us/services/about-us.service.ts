import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';

export interface AboutUsData {
  _id?: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  scrollingImages?: Array<{ public_id: string; secure_url: string; _id: string }>;
  aboutUsImages?: Array<{ secure_url: string; public_id: string; _id: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class AboutUsService {
  constructor(private http: HttpClient, private languageService: LanguageService) {}

  getAboutUsData(): Observable<{ message: string; aboutUs: AboutUsData }> {
    const langParam = this.languageService.currentLanguage;

    return this.http
      .get<{ message: string; aboutUs: AboutUsData }>(
        `${environment.baseUrl}/public/aboutUs?lang=${langParam}`
      )
      .pipe(
        catchError(() => of({ message: '', aboutUs: {} })) // Return empty object on error
      );
  }
}
