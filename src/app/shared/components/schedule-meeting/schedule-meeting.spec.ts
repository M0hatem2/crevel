import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMeeting } from './schedule-meeting';

describe('ScheduleMeeting', () => {
  let component: ScheduleMeeting;
  let fixture: ComponentFixture<ScheduleMeeting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleMeeting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMeeting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
