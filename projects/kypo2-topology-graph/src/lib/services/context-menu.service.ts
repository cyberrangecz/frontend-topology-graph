import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {NodeActionEnum} from '../model/enums/node-context-menu-items-enum';
import {Node} from 'kypo2-topology-graph-model';
import {HostService} from './host.service';
import {MenuItemResult} from '../model/events/menu-item-result';
import {map} from 'rxjs/operators';

/**
 * Service used for handling events in context menu
 */
@Injectable()
export class ContextMenuService {
  private readonly _items;

  constructor(private hostService: HostService) {
    this._items = [
      {
        id: 1,
        type: NodeActionEnum.GenerateConsoleUrl,
        title: NodeActionEnum.GenerateConsoleUrl,
      },
      {
        id: 2,
        type: NodeActionEnum.Resume,
        title: NodeActionEnum.Resume,
      },
      {
        id: 3,
        type: NodeActionEnum.Reboot,
        title: NodeActionEnum.Reboot,
      },
      {
        id: 4,
        type: NodeActionEnum.Suspend,
        title: NodeActionEnum.Suspend,
      },
];
  }

  show: Subject<{
    position: {
      x: number,
      y: number
    },
    nodeName: string
  }> = new Subject();

  getItems() {
    return this._items;
  }

  /**
   * Handles chosen context menu item by taking appropriate actions
   * @param type type of the context menu item
   * @param node node associated with the context menu
   */
  handleMenuItem(type: NodeActionEnum, node: Node): Observable<MenuItemResult> {
    return this.hostService.performAction(type, node.name)
      .pipe(
        map(payload => new MenuItemResult(type, payload))
      );
  }
}
