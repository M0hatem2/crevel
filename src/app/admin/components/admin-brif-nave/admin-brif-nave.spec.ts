import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBrifNave } from './admin-brif-nave';

describe('AdminBrifNave', () => {
  let component: AdminBrifNave;
  let fixture: ComponentFixture<AdminBrifNave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBrifNave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBrifNave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
