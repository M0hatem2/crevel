import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface SocialMediaLink {
  platform: string;
  url: string;
  _id?: string;
}

export interface FooterData {
  message: string;
  footer: {
    logo: {
      public_id: string;
      secure_url: string;
    };
    website: {
      name: string;
      url: string;
    };
    location: {
      title_en: string;
      title_ar: string;
      url: string;
    };
    _id: string;
    social: SocialMediaLink[];
    mobile: string;
    email: string;
    copyright: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private apiUrl = `${environment.apiUrl}/public/footer`;

  constructor(private http: HttpClient) {}

  getFooterData(): Observable<FooterData> {
    return this.http.get<FooterData>(this.apiUrl);
  }

  getSocialMediaLinks(): Observable<SocialMediaLink[]> {
    return this.getFooterData().pipe(
      map(response => response.footer.social)
    );
  }
}