import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetsTalkForm } from './lets-talk-form';

describe('LetsTalkForm', () => {
  let component: LetsTalkForm;
  let fixture: ComponentFixture<LetsTalkForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetsTalkForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetsTalkForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
