import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForgotPassword() {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.successMsg = res.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني';
        this.loading = false;

        // Store email for reset password component
        localStorage.setItem('resetEmail', email);

        // Redirect to reset password after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { email: email }
          });
        }, 3000);
      },
      error: (err: any) => {
        this.errorMsg = err.message || 'فشل في إرسال طلب إعادة تعيين كلمة المرور';
        this.loading = false;
      }
    });
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
