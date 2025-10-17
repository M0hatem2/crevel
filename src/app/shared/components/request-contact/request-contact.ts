import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-request-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './request-contact.html',
  styleUrls: ['./request-contact.scss']
})
export class RequestContact {
  name: string = '';
  email: string = '';
  message: string = '';
done: boolean = false;

  @Output() closeModal = new EventEmitter<void>();

  constructor(private translate: TranslateService, private apiService: ApiService) {}

  sendRequest() {
    const requestData = {
      fullName: this.name,
      email: this.email,
      message: this.message
    };

    this.apiService.post('request/contact', requestData).subscribe({
      next: (response) => {
        console.log('Request sent successfully:', response);
        this.done = true;

        // Reset form
        this.name = '';
        this.email = '';
        this.message = '';
      },
      error: (error) => {
        console.error('Error sending request:', error);
        // You can add error handling here, such as showing an error message to the user
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }
}
