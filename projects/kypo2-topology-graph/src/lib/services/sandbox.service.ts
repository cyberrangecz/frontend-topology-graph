import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable()
export class SandboxService {
  private sandboxIdSubject: ReplaySubject<number> = new ReplaySubject();
  sandboxId$: Observable<number> = this.sandboxIdSubject.asObservable();

  setId(id: number) {
    this.sandboxIdSubject.next(id);
  }
}
