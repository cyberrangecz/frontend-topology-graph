import {Observable, Subject} from 'rxjs';
import {DecoratorTimeService} from '../decorator-time.service';

export class MockDecoratorTimeService extends DecoratorTimeService {
  private subject: Subject<boolean> = new Subject();
  onRealTimeChange: Observable<boolean> = this.subject.asObservable();

  setUseRealTime(value: boolean) {
    this.subject.next(value);
  }

  getFromTime(): string | number {
    return 'now-1s';
  }

  getToTime(): string | number {
    return 'now+1s';
  }

  setRelativeTime(a: string, b: string) {

  }

  setAbsoluteTime(a: number, b: number) {

  }
}
