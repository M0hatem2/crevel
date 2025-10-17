import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaCards } from './social-media-cards';

describe('SocialMediaCards', () => {
  let component: SocialMediaCards;
  let fixture: ComponentFixture<SocialMediaCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
