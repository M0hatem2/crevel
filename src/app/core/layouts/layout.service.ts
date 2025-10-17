import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LayoutType } from './layout.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private layoutSubject = new BehaviorSubject<LayoutType>('user');
  layout$ = this.layoutSubject.asObservable();

  setLayout(layout: LayoutType) {
    this.layoutSubject.next(layout);
  }

  get currentLayout(): LayoutType {
    return this.layoutSubject.value;
  }
}
