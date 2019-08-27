import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class Kypo2TopologyErrorService {
  private errorSubject: Subject<any> = new Subject<any>();
  error$ = this.errorSubject.asObservable();

  emitError(err: any) {
    this.errorSubject.next(err);
  }
}
