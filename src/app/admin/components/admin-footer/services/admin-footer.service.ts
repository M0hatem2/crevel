import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FooterResponse, Footer } from '../footer.model';
import { environment } from '../../../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private baseURL =environment.baseUrl; // ✨ غيّرها بالرابط الأساسي بتاعك
  private token = localStorage.getItem('token')
  constructor(private http: HttpClient) {}

  /** 🔑 إعداد الهيدرز مع التوكن */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Access ${this.token}`
    });
  }

  /** 📥 جلب بيانات الفوتر */
  getFooter(): Observable<FooterResponse> {
    return this.http.get<FooterResponse>(`${this.baseURL}/admin/footer`, {
      headers: this.getHeaders()
    });
  }

  /** ✏️ تعديل بيانات الفوتر */
  updateFooter(data: any): Observable<any> {
    console.log('API URL:', `${this.baseURL}/admin/footer`);
    console.log('Request data:', data);
    console.log('Headers:', this.getHeaders().keys());

    return this.http.patch(`${this.baseURL}/admin/footer`, data, {
      headers: this.getHeaders()
    });
  }

  /** 🖼️ تغيير اللوجو */
  changeLogo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', file);

    return this.http.patch(`${this.baseURL}/admin/footer/changeLogo`, formData, {
      headers: this.getHeaders()
    });
  }

  /** ⚙️ وظيفة لتحديث التوكن لو احتجت */
  setToken(token: string) {
    this.token = token;
  }
}
