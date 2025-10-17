import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreServices } from './core-services';

describe('CoreServices', () => {
  let component: CoreServices;
  let fixture: ComponentFixture<CoreServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
