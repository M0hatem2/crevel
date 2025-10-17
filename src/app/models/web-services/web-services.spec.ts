import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServices } from './web-services';

describe('WebServices', () => {
  let component: WebServices;
  let fixture: ComponentFixture<WebServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
