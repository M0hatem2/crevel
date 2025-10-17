import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogHeader } from './blog-header';

describe('BlogHeader', () => {
  let component: BlogHeader;
  let fixture: ComponentFixture<BlogHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
