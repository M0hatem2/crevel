import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-schedule-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './schedule-meeting.html',
  styleUrls: ['./schedule-meeting.scss']
})
export class ScheduleMeeting {
  meetingForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private translate: TranslateService
  ) {
    this.meetingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  submit() {
    if (this.meetingForm.valid) {
      this.isSubmitting = true;

      const meetingData = {
        name: this.meetingForm.value.name,
        email: this.meetingForm.value.email,
        date: this.meetingForm.value.date,
        time: this.meetingForm.value.time
      };

      // Send POST request to the specified endpoint
      this.apiService.post('request/meeting', meetingData).subscribe({
        next: (response) => {
          console.log('Meeting scheduled successfully:', response);
          this.isSubmitting = false;
          this.showSuccessMessage = true;
          this.meetingForm.reset();

          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error scheduling meeting:', error);
          this.isSubmitting = false;
          alert('Error scheduling meeting. Please try again.');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.meetingForm.controls).forEach(key => {
        this.meetingForm.get(key)?.markAsTouched();
      });
    }
  }

}
