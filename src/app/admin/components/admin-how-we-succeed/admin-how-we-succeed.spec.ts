import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHowWeSucceed } from './admin-how-we-succeed';

describe('AdminHowWeSucceed', () => {
  let component: AdminHowWeSucceed;
  let fixture: ComponentFixture<AdminHowWeSucceed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHowWeSucceed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHowWeSucceed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
