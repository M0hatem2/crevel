import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleLine } from './title-line';

describe('TitleLine', () => {
  let component: TitleLine;
  let fixture: ComponentFixture<TitleLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
