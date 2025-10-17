import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { PrivacyPolicy } from '../../../../shared/components/privacy-policy/privacy-policy';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, PrivacyPolicy],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;
  showConfirmationPassword = false;
  showPrivacyPolicy = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    // Clear any existing invalid tokens on login page load
    this.clearInvalidTokens();

    this.loginForm = this.fb.group({
      userType: ['admin', Validators.required], // admin or superAdmin
      identifier: ['', [Validators.required, this.emailOrUsernameValidator()]], // username or email
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: [''], // additional field for super admin
      rememberMe: [false], // remember me checkbox
    });

    // Log initial form state
    console.log('Initial form userType value:', this.loginForm.get('userType')?.value);

    // Add conditional validation for confirmation password when user type is superAdmin
    this.setupConditionalValidation();

    // Load remembered identifier if available
    this.loadRememberedIdentifier();
  }

  private setupConditionalValidation() {
    const userTypeControl = this.loginForm.get('userType');
    const confirmationPasswordControl = this.loginForm.get('confirmationPassword');

    if (userTypeControl && confirmationPasswordControl) {
      userTypeControl.valueChanges.subscribe((value) => {
        if (value === 'superAdmin') {
          confirmationPasswordControl.setValidators([Validators.required]);
        } else {
          confirmationPasswordControl.setValidators([]);
        }
        confirmationPasswordControl.updateValueAndValidity();
      });
    }
  }

  private loadRememberedIdentifier() {
    const remembered = localStorage.getItem('rememberedIdentifier');
    if (remembered) {
      this.loginForm.patchValue({
        identifier: remembered,
      });
    }
  }

  private clearInvalidTokens() {
    // Clear any existing tokens that might be causing issues
    const currentToken = localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');

    if (currentToken || currentRole) {
      console.log('Clearing existing tokens on login page load');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('rememberedIdentifier');
    }
  }

  submitInput() {
    // Debug form state
    console.log('Form validity:', this.loginForm.valid);
    console.log('Form errors:', this.getFormValidationErrors());
    console.log('Form values:', this.loginForm.value);

    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });

      // Set specific error message based on validation errors
      const errors = this.getFormValidationErrors();
      if (errors.length > 0) {
        this.errorMsg = `Please fix the following errors: ${errors.join(', ')}`;
      } else {
        this.errorMsg = 'Please fill in all required fields correctly.';
      }
      return;
    }

    // Additional validation for super admin
    const selectedUserType = this.loginForm.value.userType;
    const selectedConfirmationPassword = this.loginForm.value.confirmationPassword;

    if (
      selectedUserType === 'superAdmin' &&
      (!selectedConfirmationPassword || selectedConfirmationPassword.trim() === '')
    ) {
      this.errorMsg = 'Confirmation password is required for super admin login.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const identifier = this.loginForm.value.identifier;
    const password = this.loginForm.value.password;
    const userType = this.loginForm.value.userType;
    const confirmationPassword = this.loginForm.value.confirmationPassword;
    const rememberMe = this.loginForm.value.rememberMe;

    let body: any;

    // For super admin, use userName instead of username
    if (userType === 'superAdmin') {
      body = {
        userName: identifier,
        password: password,
        confirmationPassword: confirmationPassword
      };
      console.log('Super admin login attempt:', body);
      console.log('User type selected:', userType);
    } else {
      // For regular admin, determine if identifier is email or username
      const isEmail = identifier.includes('@');
      body = isEmail
        ? { email: identifier, password: password }
        : { username: identifier, password: password }; // Try without userType first
      console.log('Admin login attempt (without userType):', body);
      console.log('User type selected:', userType);
      console.log('Is email format:', isEmail);
      console.log('Identifier value:', identifier);

      // Also try with userType in case server needs it
      const bodyWithUserType = isEmail
        ? { email: identifier, password: password, userType: userType }
        : { username: identifier, password: password, userType: userType };
      console.log('Alternative body with userType:', bodyWithUserType);
    }

    console.log('Login attempt:', body); // Debug log
    console.log('API URL being called:', `${this.authService['baseUrl']}/auth/signin`);

    this.authService.signin(body).subscribe({
      next: (res: any) => {
        console.log('Login response received:', res);
        console.log('Response type:', typeof res);
        console.log('Response keys:', res ? Object.keys(res) : 'null/undefined');

        // Handle the new API response structure
        let token = null;
        let userRole = null;

        // Check for accessToken in the new response structure
        if (res?.accessToken) {
          token = res.accessToken;
          userRole = res.role; // Role is at the root level in new structure
          console.log('Token found in res.accessToken, role:', userRole);
        }

        if (token && userRole) {
          // Store token and role
          localStorage.setItem('token', token);
          localStorage.setItem('role', userRole);
          console.log('Token and role saved successfully:', token.substring(0, 20) + '...', 'Role:', userRole);
          console.log('Stored role in localStorage:', localStorage.getItem('role'));
          console.log('Role comparison for redirection - received:', userRole, 'lowercase:', userRole.toLowerCase());

          // Store identifier if remember me is checked
          if (rememberMe) {
            localStorage.setItem('rememberedIdentifier', identifier);
          } else {
            localStorage.removeItem('rememberedIdentifier');
          }

          console.log('User role for redirection:', userRole);

          // Small delay to ensure localStorage is updated before navigation
          setTimeout(() => {
            // Redirect based on user role (case-insensitive)
            const roleLower = userRole.toLowerCase();
            if (roleLower === 'admin' || roleLower === 'superadmin') {
              console.log('Redirecting to admin dashboard for role:', userRole);
              this.router.navigate(['/admin'], { replaceUrl: true });
            } else if (roleLower === 'user') {
              this.router.navigate(['/home'], { replaceUrl: true });
            } else {
              // Default to home if role is unknown
              console.warn('Unknown role, redirecting to home:', userRole);
              this.router.navigate(['/home'], { replaceUrl: true });
            }
          }, 100);
        } else {
          console.error('No token found in response. Full response:', JSON.stringify(res, null, 2));
          console.error('Response structure analysis:', {
            hasData: !!res?.data,
            dataKeys: res?.data ? Object.keys(res.data) : [],
            hasToken: !!res?.token,
            hasAccessToken: !!res?.access_token,
            hasAccessTokenCapital: !!res?.accessToken,
            hasJwt: !!res?.jwt,
            responseType: typeof res,
          });

          // Try to extract any string that might be a token
          const possibleTokenFields = [
            'token',
            'access_token',
            'accessToken',
            'jwt',
            'auth_token',
            'bearer_token',
          ];
          const foundTokens = [];

          if (res) {
            for (const field of possibleTokenFields) {
              if (res[field]) {
                foundTokens.push(`${field}: ${res[field]}`);
              }
              if (res.data && res.data[field]) {
                foundTokens.push(`data.${field}: ${res.data[field]}`);
              }
            }
          }

          if (foundTokens.length > 0) {
            console.log('Found potential token fields:', foundTokens);
            this.errorMsg = `Found potential token fields but couldn't extract properly. Please check console for details.`;
          } else {
            this.errorMsg =
              'No token received from server. Please check your credentials and try again.';
          }
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Login error:', err); // Debug log

        // Clear remembered identifier on login failure for security
        localStorage.removeItem('rememberedIdentifier');

        // Provide more specific error messages
        if (err.status === 0) {
          this.errorMsg = 'Cannot connect to server. Please check if the server is running.';
        } else if (err.status === 401) {
          this.errorMsg = 'Invalid credentials. Please check your username/email and password.';
        } else if (err.status === 403) {
          this.errorMsg = 'Access denied. Please contact administrator.';
        } else if (err.status === 500) {
          this.errorMsg = 'Server error. Please try again later.';
        } else {
          // Show specific validation errors if available
          if (err.error?.validationErrors && err.error.validationErrors.length > 0) {
            const validationErrors = err.error.validationErrors.map((error: any) => {
              console.log('Individual validation error:', error);
              return error.message || error.msg || JSON.stringify(error);
            }).join(', ');
            this.errorMsg = `Validation Error: ${validationErrors}`;
          } else {
            this.errorMsg = err.error?.message || err.message || 'Login failed. Please try again.';
          }
        }
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmationPasswordVisibility() {
    this.showConfirmationPassword = !this.showConfirmationPassword;
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  openPrivacyPolicy() {
    this.showPrivacyPolicy = true;
  }

  closePrivacyPolicy() {
    this.showPrivacyPolicy = false;
  }

  private getFormValidationErrors(): string[] {
    const errors: string[] = [];

    const identifierControl = this.loginForm.get('identifier');
    if (identifierControl?.errors?.['required']) {
      errors.push('Username/Email is required');
    }
    if (identifierControl?.errors?.['invalidEmailOrUsername']) {
      errors.push('Please enter a valid email or username');
    }

    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.errors?.['required']) {
      errors.push('Password is required');
    }
    if (passwordControl?.errors?.['minlength']) {
      errors.push('Password must be at least 6 characters');
    }

    const confirmationPasswordControl = this.loginForm.get('confirmationPassword');
    if (confirmationPasswordControl?.errors?.['required']) {
      errors.push('Confirmation password is required');
    }

    return errors;
  }

  private emailOrUsernameValidator() {
    return (control: any) => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const value = control.value.trim();

      // If it contains @, validate as email
      if (value.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : { invalidEmailOrUsername: true };
      } else {
        // For username, just check it's not empty (basic validation)
        return value.length >= 2 ? null : { invalidEmailOrUsername: true };
      }
    };
  }
}
