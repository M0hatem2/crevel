import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBriefs } from './admin-briefs';

describe('AdminBriefs', () => {
  let component: AdminBriefs;
  let fixture: ComponentFixture<AdminBriefs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBriefs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBriefs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
