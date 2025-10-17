import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurBlueprint } from './our-blueprint';

describe('OurBlueprint', () => {
  let component: OurBlueprint;
  let fixture: ComponentFixture<OurBlueprint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurBlueprint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurBlueprint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
