import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable()
export class Kypo2TopologyLoadingService {
  private isLoadingSubject: Subject<boolean> = new ReplaySubject();
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  setIsLoading(value: boolean) {
    this.isLoadingSubject.next(value);
  }
}
