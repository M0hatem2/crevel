import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPortfolio } from './admin-portfolio';

describe('AdminPortfolio', () => {
  let component: AdminPortfolio;
  let fixture: ComponentFixture<AdminPortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPortfolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPortfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
