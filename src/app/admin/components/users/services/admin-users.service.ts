// This service is responsible for handling user-related operations in the admin panel.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private baseUrl = `${environment.apiUrl}`;
  private userApiUrl = `${environment.apiUrl}/admin/user`;
  private superAdminApiUrl = `${environment.apiUrl}/admin/super`;

  constructor(private http: HttpClient) {}

  // ✅ GET users with optional query params
  getUsers(params?: any): Observable<any> {
    // Convert boolean values to strings for the API
    const processedParams = params ? this.processParams(params) : {};

    console.log('AdminUsersService: Making request to:', this.userApiUrl);
    console.log('AdminUsersService: With params:', processedParams);
    console.log('AdminUsersService: With headers:', this.getAuthHeaders());

    return this.http
      .get<any>(this.userApiUrl+`?seeMore=true`, {
        headers: new HttpHeaders(this.getAuthHeaders()),
        params: processedParams,
      })
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Response received:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Error occurred:', error);

          // If the API doesn't support isBlocked or isDeleted parameters, try without them
          if (
            error.status === 500 &&
            (params?.isBlocked !== undefined || params?.isDeleted !== undefined)
          ) {
            console.log(
              'AdminUsersService: Trying fallback without isBlocked or isDeleted parameters...'
            );
            return this.getUsersFallback();
          }

          // If the API doesn't support the endpoint with query parameters, try without them
          if (
            error.status === 404 &&
            (params?.isBlocked !== undefined || params?.isDeleted !== undefined)
          ) {
            console.log('AdminUsersService: Trying fallback without query parameters...');
            return this.getUsersFallback();
          }

          return throwError(() => error);
        })
      );
  }

  // Helper method to process parameters for the API
  private processParams(params: any): any {
    const processed: any = {};
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        // Convert boolean values to strings (true -> 'true', false -> 'false')
        if (typeof value === 'boolean') {
          processed[key] = value.toString();
        } else {
          processed[key] = value;
        }
      }
    }
    return processed;
  }

  // Fallback method to get all users without filtering
  private getUsersFallback(): Observable<any> {
    console.log('AdminUsersService: Making fallback request to:', this.userApiUrl);

    return this.http
      .get<any>(this.userApiUrl, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Fallback response received:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Fallback also failed:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH confirm user
  confirmUser(id: string): Observable<any> {
    return this.http.patch<any>(
      `${this.userApiUrl}/confirm/${id}`,
      { reason: 'accept' },
      {
        headers: new HttpHeaders(this.getAuthHeaders()),
      }
    );
  }

  // ✅ PATCH block user
  blockUser(id: string, reason: string = 'yassakhairy504@gmail.com', userName: string, confirmationPassword: string): Observable<any> {
    console.log('AdminUsersService: Blocking user:', id, 'Reason:', reason);
    console.log('AdminUsersService: Full URL:', `${this.superAdminApiUrl}/addAdmin/${id}`);

    const requestBody = {
      id: id,
      reason: reason,
      userName: userName,
      confirmationPassword: confirmationPassword
    };

    console.log('AdminUsersService: Request body:', requestBody);
    console.log('AdminUsersService: Authorization header:', this.getAuthHeaders());

    return this.http
      .patch<any>(
        `${this.superAdminApiUrl}/addAdmin/${id}`,
        requestBody,
        {
          headers: new HttpHeaders(this.getAuthHeaders()),
        }
      )
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Block user response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Block user error:', error);
          console.error('AdminUsersService: Error URL:', error.url);
          console.error('AdminUsersService: Error status:', error.status);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH unblock user
  unblockUser(id: string, reason: string = 'Unblocked by admin'): Observable<any> {
    console.log('AdminUsersService: Unblocking user:', id, 'Reason:', reason);
    return this.http
      .patch<any>(
        `${this.userApiUrl}/unblock/${id}`,
        { reason: reason },
        {
          headers: new HttpHeaders(this.getAuthHeaders()),
        }
      )
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Unblock user response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Unblock user error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH unblock user with accept reason
  unblockUserWithAccept(id: string): Observable<any> {
    console.log('AdminUsersService: Unblocking user with accept reason:', id);
    return this.http
      .patch<any>(
        `${this.userApiUrl}/unblock/${id}`,
        { reason: 'accept' },
        {
          headers: new HttpHeaders(this.getAuthHeaders()),
        }
      )
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Unblock user with accept response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Unblock user with accept error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ DELETE user (following the same pattern as other user operations)
  deleteUser(id: string): Observable<any> {
    const headers = new HttpHeaders({
      ...this.getAuthHeaders(),
      'Content-Type': 'application/json',
    });

    return this.http.request<any>('DELETE', `${this.userApiUrl}/delete/${id}`, {
      body: {
        reason: 'delete',
      },
      headers: headers,
    });
  }

  // ✅ PATCH undelete user
  undeleteUser(id: string): Observable<any> {
    return this.http.patch<any>(
      `${this.userApiUrl}/undelete/${id}`,
      {
        reason: 'accept',
      },
      {
        headers: new HttpHeaders(this.getAuthHeaders()),
      }
    );
  }

  // ==================== SUPER ADMIN ENDPOINTS ====================

  // ✅ PATCH add admin role to a user
  addAdminRole(id: string, confirmationPassword: string, userEmail?: string, userName?: string): Observable<any> {
    console.log('AdminUsersService: Adding admin role to user:', id);
    console.log('AdminUsersService: Full URL:', `${this.superAdminApiUrl}/addAdmin/${id}`);

    const requestBody = {
      id: id,
      reason: userEmail || 'Adding admin role',
      userName: userName || '',
      confirmationPassword: confirmationPassword
    };

    console.log('AdminUsersService: Request body:', requestBody);
    console.log('AdminUsersService: Authorization header:', this.getAuthHeaders());

    return this.http
      .patch<any>(
        `${this.superAdminApiUrl}/addAdmin `,
        requestBody,
        {
          headers: new HttpHeaders(this.getAuthHeaders()),
        }
      )
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Add admin role response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Add admin role error:', error);
          console.error('AdminUsersService: Error URL:', error.url);
          console.error('AdminUsersService: Error status:', error.status);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH remove admin role from a user
  removeAdminRole(id: string): Observable<any> {
    console.log('AdminUsersService: Removing admin role from user:', id);
    return this.http
      .patch<any>(
        `${this.superAdminApiUrl}/removeAdmin/${id}`,
        {},
        {
          headers: new HttpHeaders(this.getAuthHeaders()),
        }
      )
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Remove admin role response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Remove admin role error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ PATCH change username
  changeUserName(id: string, newUsername: string): Observable<any> {
    console.log('AdminUsersService: Changing username for user:', id, 'New username:', newUsername);
    return this.http
      .patch<any>(
        `${this.superAdminApiUrl}/changeUserName/${id}`,
        { username: newUsername },
        {
          headers: new HttpHeaders(this.getAuthHeaders()),
        }
      )
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Change username response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Change username error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ GET retrieve all admins
  getAllAdmins(): Observable<any> {
    console.log('AdminUsersService: Retrieving all admins');
    return this.http
      .get<any>(`${this.superAdminApiUrl}/admins`, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Get all admins response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Get all admins error:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ GET retrieve a specific admin
  getAdminById(id: string): Observable<any> {
    console.log('AdminUsersService: Retrieving admin by ID:', id);
    return this.http
      .get<any>(`${this.superAdminApiUrl}/admins/${id}`, {
        headers: new HttpHeaders(this.getAuthHeaders()),
      })
      .pipe(
        tap((response) => {
          console.log('AdminUsersService: Get admin by ID response:', response);
        }),
        catchError((error) => {
          console.error('AdminUsersService: Get admin by ID error:', error);
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
