import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data?: {
    token: string;
    user: any;
  };
  message?: string;
}

export interface OtpRequest {
  email: string;
}

export interface ConfirmOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ConfirmEmailRequest {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  signin(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('AuthService: Attempting login with:', credentials);
    console.log('AuthService: API URL:', `${this.baseUrl}/auth/signin`);
    console.log('AuthService: Request headers:', this.getAuthHeaders());

    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/signin`, credentials, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response: any) => {
          console.log('AuthService: Login response received:', response);
          console.log('AuthService: Response status:', 'success');
        }),
        catchError((error) => {
          console.error('AuthService: Login error details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });

          // Log validation errors if available
          if (error.error?.validationErrors) {
            console.error('AuthService: Server validation errors:', error.error.validationErrors);
            console.error('AuthService: First validation error details:', error.error.validationErrors[0]);
          }

          return this.handleError(error);
        })
      );
  }

  signup(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/signup`, userData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.signup(userData);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}/auth/refresh-token`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  // Get Authorization header for API calls
  getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        Authorization: `Access ${token}`,
      };
    }
    return {};
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get user role from token
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.role || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // OTP Methods
  resendOtp(email: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/resend-otp`, { email })
      .pipe(catchError(this.handleError));
  }

  confirmOtp(otpData: ConfirmOtpRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/confirm-otp`, otpData)
      .pipe(catchError(this.handleError));
  }

  // Password Reset Methods
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/reset-password`, resetData)
      .pipe(catchError(this.handleError));
  }

  // Email Confirmation
  confirmEmail(token: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/confirm-email`, { token })
      .pipe(catchError(this.handleError));
  }

  // Verify user role from server
  verifyUserRole(): Observable<{ role: string }> {
    return this.http
      .get<{ role: string }>(`${this.baseUrl}/auth/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
