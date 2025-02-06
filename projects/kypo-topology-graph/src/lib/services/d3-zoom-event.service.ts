import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Service used to trigger events when d3 zoom changed (user zoomed in or out)
 */
@Injectable()
export class D3ZoomEventService {
  private onZoomChangeSubject: Subject<number> = new Subject();
  onZoomChange: Observable<number> = this.onZoomChangeSubject.asObservable();

  /**
   * Triggers zoom change event to notify all subscribers
   * @param {number} zoomScale current zoom scale
   */
  triggerZoomChange(zoomScale: number) {
    this.onZoomChangeSubject.next(zoomScale);
  }
}
