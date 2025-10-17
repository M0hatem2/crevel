import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brife } from './brife';

describe('Brife', () => {
  let component: Brife;
  let fixture: ComponentFixture<Brife>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brife]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brife);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
