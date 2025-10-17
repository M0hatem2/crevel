import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 import { talkService } from './services/talk.service';
import {
  FooterService,
  FooterData,
  FooterResponse,
} from '../../shared/components/footer/services/footer.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lets-talk-form',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './lets-talk-form.html',
  styleUrl: './lets-talk-form.scss',
})
export class LetsTalkForm implements OnInit {
  private talkService = inject(talkService);
  private footerService = inject(FooterService);

  firstName = '';
  lastName = '';
  service = '';
  phone = '';
  email = '';
  message = '';
  showSuccess = false;
  footerData: FooterData | null = null;
  translationsLoaded = false;

  constructor(private router: Router,private translate: TranslateService) {
    console.log('LetsTalkForm: Component initialized');
 
    }

  ngOnInit() {
    this.footerService.getFooterData().subscribe({
      next: (response: FooterResponse) => {
        this.footerData = response.footer;
        console.log('LetsTalkForm: Footer data loaded:', this.footerData);
      },
      error: (error: any) => {
        console.error('Error fetching footer data:', error);
      },
    });
   
  }

  onSubmit() {
    const formData = {
      firstName: this.firstName,
      lastName: this.lastName,
      service: this.service,
      phone: this.phone,
      email: this.email,
      message: this.message,
    };
    this.talkService.sendContact(formData).subscribe({
      next: (response) => {
        this.showSuccess = true;
        // Reset form
        this.firstName = '';
        this.lastName = '';
        this.service = '';
        this.phone = '';
        this.email = '';
        this.message = '';
      },
      error: (error) => {
        console.error('Error sending contact:', error);
        // Optionally show error message
      },
    });
  }
}
