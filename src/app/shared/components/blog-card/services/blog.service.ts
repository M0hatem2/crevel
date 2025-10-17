import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Blog } from '../../../../models/blog.interface';

@Injectable({
  providedIn: 'root',
})
export class BlogCardService {
  constructor(private apiService: ApiService, private languageService: LanguageService) {}

  getBlogs(): Observable<Blog[]> {
    return this.apiService
      .get<{ message: string; data: { data: Blog[] } }>(
        'blog/blogs'
      )
      .pipe(
        map((response) => {
          console.log('API Response:', response);
          return response.data.data;
        })
      );
  }
}
