import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestContact } from './request-contact';

describe('RequestContact', () => {
  let component: RequestContact;
  let fixture: ComponentFixture<RequestContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
