// This service is responsible for handling blog-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminBlogService {
  private apiUrl = `${environment.apiUrl}/admin/blog`;

  constructor(private http: HttpClient) {}

  // ✅ GET blogs
  getBlogs(): Observable<any> {
    console.log('AdminBlogService: Making request to:', this.apiUrl);
    console.log('AdminBlogService: With headers:', this.getAuthHeaders());

    return this.http
      .get<any>(this.apiUrl, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminBlogService: Response received:', response);
        }),
        map((response) => response.blogs?.data || response.data || response), // Handle both wrapped and direct responses
        catchError((error) => {
          console.error('AdminBlogService: Error occurred:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ POST add blog
  addBlog(blog: any): Observable<any> {
    console.log('AdminBlogService: Adding blog:', blog);
    return this.http
      .post<any>(this.apiUrl, blog, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminBlogService: Add blog response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminBlogService: Add blog error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH edit blog
  editBlog(id: string, blog: any): Observable<any> {
    console.log('AdminBlogService: Editing blog:', id, blog);
    return this.http
      .patch<any>(`${this.apiUrl}/${id}`, blog, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminBlogService: Edit blog response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminBlogService: Edit blog error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ DELETE delete blog
  deleteBlog(id: string): Observable<any> {
    console.log('AdminBlogService: Deleting blog:', id);
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, {
        headers: new HttpHeaders(this.getAuthHeaders()),
        body: { reason: 'Deleted by admin' }, // Send reason in body as server expects it
      })
      .pipe(
        tap((response) => {
          console.log('AdminBlogService: Delete blog response:', response);
        }),
        map((response) => response.data || response),
        catchError((error) => {
          console.error('AdminBlogService: Delete blog error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ Auth Headers helper
  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Access ${token}` } : {};
  }
}