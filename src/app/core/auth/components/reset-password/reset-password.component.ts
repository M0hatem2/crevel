import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Get email from route parameters or localStorage
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || localStorage.getItem('resetEmail') || '';
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  submitResetPassword() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const resetData = {
      email: this.email,
      otp: this.resetForm.value.otp,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.resetPassword(resetData).subscribe({
      next: (res: any) => {
        this.successMsg = res.message || 'تم إعادة تعيين كلمة المرور بنجاح';
        this.loading = false;

        // Clear stored email
        localStorage.removeItem('resetEmail');

        // Redirect to login after successful password reset
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMsg = err.message || 'فشل في إعادة تعيين كلمة المرور';
        this.loading = false;
      }
    });
  }
}
