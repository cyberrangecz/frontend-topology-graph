import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service used for handling mouse events after right click.
 */

@Injectable()
export class ContextMenuService {

  public show: Subject<{ position: { x: number, y: number }, obj: any[] }> = new Subject();
}
