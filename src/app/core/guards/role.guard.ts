import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { map, catchError, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // First try to get role from localStorage (set during login)
  const storedRole = localStorage.getItem('role');
  if (storedRole) {
    console.log('Role guard: Found stored role:', storedRole, 'for route:', state.url);
    console.log('Role guard: Role comparison - stored:', storedRole.toLowerCase(), 'expected: superadmin');
    return of(checkRoleAndNavigate(storedRole));
  }

  // Fallback to JWT decoding
  const userRole = authService.getUserRole();
  console.log('Role guard: JWT decoded role:', userRole, 'for route:', state.url);

  if (userRole) {
    return of(checkRoleAndNavigate(userRole));
  } else {
    // If no role found, logout and redirect to login
    console.error('Role guard: No role found, logging out. Route:', state.url);
    authService.logout();
    router.navigate(['/auth/login']);
    return of(false);
  }

  function checkRoleAndNavigate(userRole: string): boolean {
    console.log('Role guard: Checking role for route:', state.url, 'User role:', userRole);

    // Define allowed roles for admin routes
    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some((routePath) => state.url.startsWith(routePath));

    if (isAdminRoute) {
      console.log('Role guard: Admin route detected, checking permissions');
      // Only allow admin and superAdmin to access admin routes (case-insensitive)
      const roleLower = userRole.toLowerCase();
      if (roleLower !== 'admin' && roleLower !== 'superadmin') {
        console.error('Role guard: Access denied for role:', userRole, 'Route:', state.url);
        // Redirect to unauthorized page or home
        router.navigate(['/'], { queryParams: { unauthorized: true } });
        return false;
      } else {
        console.log('Role guard: Access granted for role:', userRole);
      }
    }

    // For non-admin routes, allow all authenticated users
    return true;
  }
};
