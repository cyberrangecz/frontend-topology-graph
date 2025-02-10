import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DecoratorStateService {
  private active: boolean;
  private activeSubject: Subject<boolean> = new Subject<boolean>();
  activeObs: Observable<boolean> = this.activeSubject.asObservable();

  constructor() {
    this.active = true;
  }

  toggle() {
    this.active = !this.active;
    this.activeSubject.next(this.active);
  }

  setActive(value: boolean) {
    this.active = value;
    this.activeSubject.next(this.active);
  }

  getActive(): boolean {
    return this.active;
  }
}
