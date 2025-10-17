import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsCards } from './blogs-cards';

describe('BlogsCards', () => {
  let component: BlogsCards;
  let fixture: ComponentFixture<BlogsCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
