import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable } from 'rxjs';

/**
 * Global service holding state of active sandbox
 */
@Injectable()
export class SandboxService {
  private sandboxIdSubject: BehaviorSubject<number> = new BehaviorSubject(null);
  sandboxId$: Observable<number> = this.sandboxIdSubject.asObservable();

  setId(id: number) {
    this.sandboxIdSubject.next(id);
  }
}
