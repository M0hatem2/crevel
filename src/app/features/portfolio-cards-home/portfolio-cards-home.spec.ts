import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCardsHome } from './portfolio-cards-home';

describe('PortfolioCardsHome', () => {
  let component: PortfolioCardsHome;
  let fixture: ComponentFixture<PortfolioCardsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCardsHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioCardsHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
