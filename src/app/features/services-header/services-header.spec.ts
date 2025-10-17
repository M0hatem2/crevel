import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesHeader } from './services-header';

describe('ServicesHeader', () => {
  let component: ServicesHeader;
  let fixture: ComponentFixture<ServicesHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
