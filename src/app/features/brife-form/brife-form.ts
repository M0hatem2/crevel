import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TalkService } from './services/brife.service';
import { BriefRequest, BriefResponse } from '../../models/brife/brife';

@Component({
  selector: 'app-brife-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './brife-form.html',
  styleUrls: ['./brife-form.scss'],
})
export class BrifeFormComponent {
  private fb = inject(FormBuilder);
  private talkService = inject(TalkService);
  private translate = inject(TranslateService);

  // Form group
  briefForm: FormGroup = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]],
    businessSector: ['', [Validators.required, Validators.minLength(2)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    website: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    socialMediaLinks: [''],
  });

  // Loading and error states
  isLoading = false;
  submitError = '';
  submitSuccess = false;

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.briefForm.valid) {
      this.isLoading = true;
      this.submitError = '';
      this.submitSuccess = false;

      // Prepare the data
      const formData: BriefRequest = {
        ...this.briefForm.value,
        socialMediaLinks: this.parseSocialMediaLinks(this.briefForm.value.socialMediaLinks),
      };

      // Debug: Log the data being sent
      console.log('Sending data to server:', formData);

      // Submit the form
      this.talkService.createBrief(formData).subscribe({
        next: (response: BriefResponse) => {
          this.isLoading = false;
          console.log('Server response:', response);

          if (response.data) {
            this.submitSuccess = true;
            this.briefForm.reset();
            console.log('Brief created successfully:', response);
          } else {
            this.submitError = response.message || 'Failed to create brief';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.submitError = error.message || 'An error occurred while creating the brief';
          console.error('Error creating brief:', error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Parse social media links from textarea
   */
  private parseSocialMediaLinks(linksText: string): string[] {
    if (!linksText || linksText.trim() === '') {
      return [];
    }
    return linksText
      .split('\n')
      .map((link) => link.trim())
      .filter((link) => link.length > 0 && link.startsWith('https://'));
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.briefForm.controls).forEach((key) => {
      const control = this.briefForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get error message for a specific form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.briefForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        const fieldLabel = this.getFieldLabel(controlName);
        return this.translate
          .instant('COMMON.BRIEF_FORM.VALIDATION.COMPANY_NAME_REQUIRED')
          .replace('{{field}}', fieldLabel);
      }
      if (control.errors['email']) {
        return this.translate.instant('COMMON.BRIEF_FORM.VALIDATION.EMAIL_INVALID');
      }
      if (control.errors['minlength']) {
        const fieldLabel = this.getFieldLabel(controlName);
        return this.translate
          .instant('COMMON.BRIEF_FORM.VALIDATION.COMPANY_NAME_MIN_LENGTH')
          .replace('{{field}}', fieldLabel)
          .replace('{{length}}', control.errors['minlength'].requiredLength.toString());
      }
      if (control.errors['pattern']) {
        if (controlName === 'mobileNumber') {
          return this.translate.instant('COMMON.BRIEF_FORM.VALIDATION.MOBILE_INVALID');
        }
        if (controlName === 'website') {
          return this.translate.instant('COMMON.BRIEF_FORM.VALIDATION.WEBSITE_INVALID');
        }
      }
    }
    return '';
  }

  /**
   * Get human-readable field label
   */
  private getFieldLabel(controlName: string): string {
    const labelKeys: { [key: string]: string } = {
      companyName: 'COMMON.BRIEF_FORM.COMPANY_NAME',
      businessSector: 'COMMON.BRIEF_FORM.BUSINESS_SECTOR',
      mobileNumber: 'COMMON.BRIEF_FORM.MOBILE_NUMBER',
      email: 'FORMS.EMAIL_ADDRESS',
      website: 'COMMON.BRIEF_FORM.WEBSITE',
    };
    return this.translate.instant(labelKeys[controlName] || controlName);
  }
}
