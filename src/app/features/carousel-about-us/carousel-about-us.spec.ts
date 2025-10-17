import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselAboutUs } from './carousel-about-us';

describe('CarouselAboutUs', () => {
  let component: CarouselAboutUs;
  let fixture: ComponentFixture<CarouselAboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselAboutUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselAboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
