import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { PrivacyPolicy } from "../../../../shared/components/privacy-policy/privacy-policy";

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, PrivacyPolicy],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;
  showPrivacyPolicy = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required], // username or email
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false], // remember me checkbox
    });

    // Load remembered identifier if available
    this.loadRememberedIdentifier();
  }

  private loadRememberedIdentifier() {
    const remembered = localStorage.getItem('rememberedIdentifier');
    if (remembered) {
      this.loginForm.patchValue({
        identifier: remembered,
      });
    }
  }

  submitInput() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const identifier = this.loginForm.value.identifier;
    const password = this.loginForm.value.password;
    const rememberMe = this.loginForm.value.rememberMe;

    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');
    const body = isEmail
      ? { email: identifier, password, userType: 'user' }
      : { username: identifier, password, userType: 'user' };

    console.log('User login attempt:', body);

    this.authService.signin(body).subscribe({
      next: (res: any) => {
        console.log('Login response received:', res);

        // Handle different possible response structures
        let token = null;
        let user = null;

        // Check for token in various possible locations
        if (res?.data?.token) {
          token = res.data.token;
          user = res.data.user;
        } else if (res?.token) {
          token = res.token;
          user = res.user;
        } else if (res?.data?.access_token) {
          token = res.data.access_token;
          user = res.data.user;
        } else if (res?.access_token) {
          token = res.access_token;
          user = res.user;
        } else if (res?.data?.accessToken) {
          token = res.data.accessToken;
          user = res.data.user;
        } else if (res?.accessToken) {
          token = res.accessToken;
          user = res.user;
        } else if (res?.data?.jwt) {
          token = res.data.jwt;
          user = res.data.user;
        } else if (res?.jwt) {
          token = res.jwt;
          user = res.user;
        }

        if (token) {
          localStorage.setItem('token', token);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            if (user.role) {
              localStorage.setItem('role', user.role);
            }
          }

          // Store identifier if remember me is checked
          if (rememberMe) {
            localStorage.setItem('rememberedIdentifier', identifier);
          } else {
            localStorage.removeItem('rememberedIdentifier');
          }

          // Get role from response or token
          let userRole = null;
          if (res?.role) {
            userRole = res.role;
          } else if (res?.user?.role) {
            userRole = res.user.role;
          } else if (res?.data?.user?.role) {
            userRole = res.data.user.role;
          } else {
            userRole = this.authService.getUserRole();
          }

          console.log('User role for redirection:', userRole);

          // Redirect based on user role - regular users go to home
          if (userRole === 'user') {
            this.router.navigate(['/home']);
          } else {
            // If somehow an admin/super admin got here, redirect to admin
            this.router.navigate(['/admin']);
          }
        } else {
          console.error('No token found in response. Full response:', JSON.stringify(res, null, 2));
          this.errorMsg = 'No token received from server. Please check your credentials and try again.';
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Login error:', err);

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
          this.errorMsg = err.error?.message || err.message || 'Login failed. Please try again.';
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

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  openPrivacyPolicy() {
    this.showPrivacyPolicy = true;
  }

  closePrivacyPolicy() {
    this.showPrivacyPolicy = false;
  }
}