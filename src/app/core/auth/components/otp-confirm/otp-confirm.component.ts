import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-otp-confirm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './otp-confirm.component.html',
  styleUrls: ['./otp-confirm.component.css']
})
export class OtpConfirmComponent implements OnInit {
  otpForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    // Get email from route parameters or localStorage
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || localStorage.getItem('userEmail') || '';
    });
  }

  submitOtp() {
    if (this.otpForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const otpData = {
      email: this.email,
      otp: this.otpForm.value.otp
    };

    this.authService.confirmOtp(otpData).subscribe({
      next: (res: any) => {
        console.log('OTP confirmation response received:', res);

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
          }
          console.log('Token saved successfully after OTP confirmation');

          this.successMsg = res.message || 'تم تأكيد OTP بنجاح';
          this.loading = false;

          // Redirect to dashboard after successful OTP confirmation
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 2000);
        } else {
          console.error('No token found in OTP confirmation response');
          this.errorMsg = 'OTP confirmed but no authentication token received. Please contact support.';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.errorMsg = err.message || 'فشل في تأكيد OTP';
        this.loading = false;
      }
    });
  }

  resendOtp() {
    if (!this.email) {
      this.errorMsg = 'البريد الإلكتروني مطلوب لإرسال OTP جديد';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.authService.resendOtp(this.email).subscribe({
      next: (res: any) => {
        this.successMsg = 'تم إرسال OTP جديد إلى بريدك الإلكتروني';
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMsg = err.message || 'فشل في إرسال OTP جديد';
        this.loading = false;
      }
    });
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
