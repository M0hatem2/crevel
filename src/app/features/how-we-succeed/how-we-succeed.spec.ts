import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowWeSucceed } from './how-we-succeed';

describe('HowWeSucceed', () => {
  let component: HowWeSucceed;
  let fixture: ComponentFixture<HowWeSucceed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowWeSucceed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowWeSucceed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
