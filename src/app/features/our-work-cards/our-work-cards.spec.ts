import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurWorkCards } from './our-work-cards';

describe('OurWorkCards', () => {
  let component: OurWorkCards;
  let fixture: ComponentFixture<OurWorkCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurWorkCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurWorkCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
