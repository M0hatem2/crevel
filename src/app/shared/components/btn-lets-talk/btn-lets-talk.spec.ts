import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLetsTalk } from './btn-lets-talk';

describe('BtnLetsTalk', () => {
  let component: BtnLetsTalk;
  let fixture: ComponentFixture<BtnLetsTalk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLetsTalk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnLetsTalk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
