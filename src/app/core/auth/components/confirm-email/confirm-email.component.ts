import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  loading = true;
  errorMsg = '';
  successMsg = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Get token from route parameters
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.confirmEmail();
      } else {
        this.errorMsg = 'رمز التأكيد مفقود';
        this.loading = false;
      }
    });
  }

  confirmEmail() {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.confirmEmail(this.token).subscribe({
      next: (res: any) => {
        this.successMsg = res.message || 'تم تأكيد البريد الإلكتروني بنجاح';
        this.loading = false;

        // Redirect to login after successful email confirmation
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err: any) => {
        this.errorMsg = err.message || 'فشل في تأكيد البريد الإلكتروني';
        this.loading = false;
      }
    });
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
