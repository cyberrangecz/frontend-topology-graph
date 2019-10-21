import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {TopologyError} from '../model/others/topology-error.model';

@Injectable()
export class Kypo2TopologyErrorService {
  private errorSubject: Subject<any> = new Subject<any>();
  error$ = this.errorSubject.asObservable();

  emitError(err: TopologyError) {
    this.errorSubject.next(err);
  }
}
