import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminContactService, ContactItem, ContactResponse } from './services/admin-contact.service';

@Component({
  selector: 'app-admin-contact',
  imports: [CommonModule, TranslateModule],
  templateUrl: './admin-contact.html',
  styleUrl: './admin-contact.scss'
})
export class AdminContact implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  contacts: ContactItem[] = [];
  loading = false;
  error: string | null = null;
  message = '';

  constructor(private adminContactService: AdminContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadContacts(): void {
    this.loading = true;
    this.error = null;

    this.adminContactService.getContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ContactResponse) => {
          this.loading = false;
          this.contacts = response.Contacts.data;
          this.message = response.message;
          console.log('Contacts loaded successfully:', response);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Failed to load contacts';
          console.error('Error loading contacts:', error);
        }
      });
  }

  refreshContacts(): void {
    this.loadContacts();
  }

  trackByContactId(index: number, contact: ContactItem): string {
    return contact._id;
  }
}
