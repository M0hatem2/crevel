import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-brief',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './new-brief.html',
  styleUrls: ['./new-brief.scss']
})
export class NewBrief {
  projectName: string = '';
  email: string = '';
  description: string = '';
  mobileNumber: string = '';
  budget: number = 0;
  done: boolean = false;

  @Output() closeModal = new EventEmitter<void>();

  constructor(private translate: TranslateService) {}

  // Method to get translation with fallback
  getTranslation(key: string, fallback: string): string {
    const translation = this.translate.instant(key);
    return translation && translation !== key ? translation : fallback;
  }

  sendRequest() {
    console.log('Form Data:', {
      projectName: this.projectName,
      email: this.email,
      description: this.description,
      mobileNumber: this.mobileNumber,
      budget: this.budget
    });
    this.done = true;

    // Reset form
    this.projectName = '';
    this.email = '';
    this.description = '';
    this.mobileNumber = '';
    this.budget = 0;
  }

  onClose() {
    this.closeModal.emit();
  }
}
