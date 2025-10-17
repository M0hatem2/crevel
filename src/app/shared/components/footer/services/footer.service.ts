import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LanguageService } from '../../../../core/services/language.service';

export interface SocialLink {
  platform: string;
  url: string;
  _id?: string;
}

export interface Logo {
  public_id: string;
  secure_url: string;
}

export interface Website {
  name: string;
  url: string;
}

export interface Location {
  title_en: string;
  title_ar: string;
  url: string;
}

export interface FooterData {
  logo: Logo;
  website: Website;
  location: Location;
  _id: string;
  social: SocialLink[];
  mobile: string;
  email: string;
  copyright: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FooterResponse {
  message: string;
  footer: FooterData;
}

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private apiUrl = `${environment.baseUrl}/public/footer`;
  private footerDataSubject = new BehaviorSubject<FooterData | null>(null);
  public footerData$ = this.footerDataSubject.asObservable();

  constructor(private http: HttpClient, private languageService: LanguageService) {}

  getFooterData(): Observable<FooterResponse> {
    const langParam = this.languageService.currentLanguage;
    const urlWithLang = `${this.apiUrl}?lang=${langParam}`;
    console.log('Fetching footer data from:', urlWithLang);

    return this.http.get<FooterResponse>(urlWithLang);
  }

  // Method to manually set footer data for testing
  setFooterData(data: FooterData) {
    this.footerDataSubject.next(data);
  }

  
}
