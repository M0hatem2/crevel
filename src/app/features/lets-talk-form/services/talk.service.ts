import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class talkService {
  constructor(private http: HttpClient) {}
  private url = environment.baseUrl;
  sendContact(formData: any): Observable<any> {
    const payload = {
      name: formData.firstName,
      name2: formData.lastName,
      email: formData.email,
      service: formData.service,
      phoneNumber: formData.phone,
      message: formData.message,
    };
    console.log(payload);
   
    return this.http.post(`${this.url}/request/contactUS`, payload);
  }
}
