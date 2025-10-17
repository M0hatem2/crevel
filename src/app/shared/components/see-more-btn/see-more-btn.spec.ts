import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeMoreBtn } from './see-more-btn';

describe('SeeMoreBtn', () => {
  let component: SeeMoreBtn;
  let fixture: ComponentFixture<SeeMoreBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeMoreBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeMoreBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
