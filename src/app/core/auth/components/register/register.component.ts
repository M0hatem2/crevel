import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { PrivacyPolicy } from '../../../../shared/components/privacy-policy/privacy-policy';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, PrivacyPolicy],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  showPrivacyPolicy = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private languageService: LanguageService) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]]
    });
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.authService.signup(this.registerForm.value).subscribe({
      next: (res: any) => {
        console.log('✅ Success:', res);
        this.loading = false;
        this.successMsg = res.message || 'Registration successful! Please check your email for OTP verification.';

        // Store email for OTP verification
        localStorage.setItem('userEmail', this.registerForm.value.email);

        // Navigate to OTP confirmation after a short delay
        setTimeout(() => {
          this.router.navigate(['/auth/otp-confirm'], {
            queryParams: { email: this.registerForm.value.email }
          });
        }, 2000);
      },
      error: (err: any) => {
        console.error('❌ Error:', err);
        this.loading = false;

        if (err.status === 409) {
          this.errorMsg = 'User already exists with this email address.';
        } else if (err.status === 500) {
          this.errorMsg = 'Registration failed. Please try again later.';
        } else {
          this.errorMsg = err.error?.message || 'An error occurred during registration.';
        }
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        if (fieldName === 'fullName') {
          return 'Full name must be at least 2 characters';
        }
        if (fieldName === 'password') {
          return 'Password must be at least 8 characters';
        }
      }
      if (field.errors['pattern']) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
    }
    return '';
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
