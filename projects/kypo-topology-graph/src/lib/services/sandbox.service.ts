import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Global service holding state of active sandbox
 */
@Injectable()
export class SandboxService {
  private sandboxInstanceIdSubject: BehaviorSubject<number> = new BehaviorSubject(null);
  sandboxInstanceId$: Observable<number> = this.sandboxInstanceIdSubject.asObservable();

  private sandboxDefinitionIdSubject: BehaviorSubject<number> = new BehaviorSubject(null);
  sandboxDefinitionId$: Observable<number> = this.sandboxDefinitionIdSubject.asObservable();

  setSandboxInstanceId(id: number) {
    this.sandboxInstanceIdSubject.next(id);
  }

  setSandboxDefinitionId(id: number) {
    this.sandboxDefinitionIdSubject.next(id);
  }
}
