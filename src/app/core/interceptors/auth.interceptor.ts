import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const translate = inject(TranslateService);

  // Skip auth for login and public endpoints
  if (
    req.url.includes('/auth/signin') ||
    req.url.includes('/auth/signup') ||
    req.url.includes('/public/')
  ) {
    console.log('AuthInterceptor: Skipping auth for public endpoint:', req.url);
    return next(req);
  }

  // Get the token from AuthService
  const token = authService.getToken();

  // Clone the request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Access ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      console.log('Auth interceptor caught error:', error.status, error.url, error.error);

      // Only check for token expiration on protected endpoints, not on auth endpoints
      const isAuthEndpoint = error.url?.includes('/auth/') && !error.url?.includes('/auth/signin');
      const isTokenExpired =
        error.status === 401 || (error.status === 500 && error.error?.message === 'jwt expired');

      if (isTokenExpired && !isAuthEndpoint) {
        if (token) {
          console.log('Token exists, attempting refresh');
          // Token might be expired, try to refresh it
          return authService.refreshToken().pipe(
            switchMap((response) => {
              console.log('Refresh response:', response);
              if (response.data?.token) {
                // Update the token in localStorage
                localStorage.setItem('token', response.data.token);
                // Retry the original request with the new token
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Access ${response.data.token}`,
                  },
                });
                return next(newReq);
              } else {
                // Refresh failed, logout user and redirect to login
                console.log('Refresh failed, logging out');
                authService.logout();
                const message = translate.instant('ERRORS.SESSION_EXPIRED');
                alert(message);
                router.navigate(['/auth/login']);
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              console.log('Refresh error:', refreshError);
              // Refresh failed, logout user and redirect to login
              authService.logout();
              const message = translate.instant('ERRORS.SESSION_EXPIRED');
              alert(message);
              router.navigate(['/auth/login']);
              return throwError(() => error);
            })
          );
        } else {
          console.log('No token, redirecting to login');
          // No token but got auth error, redirect to login
          authService.logout();
          const message = translate.instant('ERRORS.SESSION_EXPIRED');
          alert(message);
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }
      }
      return throwError(() => error);
    })
  );
};
