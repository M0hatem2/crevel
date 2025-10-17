import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutUS } from './admin-about-us';

describe('AdminAboutUS', () => {
  let component: AdminAboutUS;
  let fixture: ComponentFixture<AdminAboutUS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAboutUS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAboutUS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
