import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactUs } from './admin-contact-us';

describe('AdminContactUs', () => {
  let component: AdminContactUs;
  let fixture: ComponentFixture<AdminContactUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminContactUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContactUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
