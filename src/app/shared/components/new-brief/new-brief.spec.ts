import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBrief } from './new-brief';

describe('NewBrief', () => {
  let component: NewBrief;
  let fixture: ComponentFixture<NewBrief>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBrief]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBrief);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
