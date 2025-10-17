import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioHeader } from './portfolio-header';

describe('PortfolioHeader', () => {
  let component: PortfolioHeader;
  let fixture: ComponentFixture<PortfolioHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
