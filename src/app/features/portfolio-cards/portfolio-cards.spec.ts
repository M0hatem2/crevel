import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PortfolioCardsService } from './portfolio-cards';

describe('PortfolioCardsService', () => {
  let service: PortfolioCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioCardsService]
    });
    service = TestBed.inject(PortfolioCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return portfolio data', (done) => {
    service.getPortfolio().subscribe(response => {
      expect(response.status).toBe('success');
      expect(response.data).toBeDefined();
      expect(response.data.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return a single portfolio item by id', (done) => {
    service.getPortfolioById('1').subscribe(response => {
      expect(response.status).toBe('success');
      expect(response.data).toBeDefined();
      expect(response.data._id).toBe('1');
      done();
    });
  });

  it('should return error for invalid portfolio id', (done) => {
    service.getPortfolioById('invalid-id').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toContain('not found');
        done();
      }
    });
  });
});
