import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {ContextMenuItemsEnum} from '../model/enums/node-context-menu-items-enum';

/**
 * Service used for handling mouse events after right click.
 */

@Injectable()
export class ContextMenuService {

  private _items;

  constructor() {
    this._items = [
      {
        id: 1,
        type: ContextMenuItemsEnum.RemoteConnection,
        title: ContextMenuItemsEnum.RemoteConnection,
      }
      /*      {
              id: 2,
              type: ContextMenuItemsEnum.Start,
              title: ContextMenuItemsEnum.Start,
              subject: new Subject()
            },
            {
              id: 3,
              type: ContextMenuItemsEnum.Restart,
              title: ContextMenuItemsEnum.Restart,
              subject: new Subject()
            },
            {
              id: 4,
              type: ContextMenuItemsEnum.CreateRunningSnapshot,
              title: ContextMenuItemsEnum.CreateRunningSnapshot,
              subject: new Subject()
            },
            {
              id: 5,
              type: ContextMenuItemsEnum.RevertRunningSnapshot,
              title: ContextMenuItemsEnum.RevertRunningSnapshot,
              subject: new Subject()
            },*/
    ];
  }

  show: Subject<{
    position: {
      x: number,
      y: number
    },
    nodeId: number
  }> = new Subject();

  getItems() {
    return this._items;
  }

  handleMenuItem(type: ContextMenuItemsEnum, nodeId: number) {
    switch (type) {
      case ContextMenuItemsEnum.RemoteConnection: {

        // call remote connection service
        break;
      }
      case ContextMenuItemsEnum.Start: {
        // call start service
        break;
      }
      case ContextMenuItemsEnum.Restart: {
        // call restart service
        break;
      }
      case ContextMenuItemsEnum.CreateRunningSnapshot: {
        // call create running snapshot service
        break;
      }
      case ContextMenuItemsEnum.RevertRunningSnapshot: {
        // call revert running snapshot service
        break;
      }
      default: {
        // error
      }
    }
  }
}
