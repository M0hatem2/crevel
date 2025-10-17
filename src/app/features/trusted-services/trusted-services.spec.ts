import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedServices } from './trusted-services';

describe('TrustedServices', () => {
  let component: TrustedServices;
  let fixture: ComponentFixture<TrustedServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
