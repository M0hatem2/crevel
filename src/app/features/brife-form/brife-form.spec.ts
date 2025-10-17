import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrifeForm } from './brife-form';

describe('BrifeForm', () => {
  let component: BrifeForm;
  let fixture: ComponentFixture<BrifeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrifeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(BrifeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
