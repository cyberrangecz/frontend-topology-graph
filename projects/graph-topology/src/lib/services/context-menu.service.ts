import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {ContextMenuItemsEnum} from '../model/enums/node-context-menu-items-enum';
import {SandboxService} from './sandbox.service';
import {Node} from '../model/node/node';
import {HostService} from './host.service';

/**
 * Service used for handling mouse events after right click.
 */

@Injectable()
export class ContextMenuService {

  private readonly _items;

  constructor(private sandboxService: SandboxService,
              private hostService: HostService) {
    this._items = [
      {
        id: 1,
        type: ContextMenuItemsEnum.RemoteConnection,
        title: ContextMenuItemsEnum.RemoteConnection,
      },
      {
        id: 2,
        type: ContextMenuItemsEnum.Start,
        title: ContextMenuItemsEnum.Start,
      },
      {
        id: 3,
        type: ContextMenuItemsEnum.Restart,
        title: ContextMenuItemsEnum.Restart,
      },
      {
        id: 4,
        type: ContextMenuItemsEnum.CreateRunningSnapshot,
        title: ContextMenuItemsEnum.CreateRunningSnapshot,
      },
      {
        id: 5,
        type: ContextMenuItemsEnum.RevertRunningSnapshot,
        title: ContextMenuItemsEnum.RevertRunningSnapshot,
      },
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

  /**
   * Handles chosen context menu item by taking appropriate actions
   * @param type type of the context menu item
   * @param node node associated with the context menu
   */
  handleMenuItem(type: ContextMenuItemsEnum, node: Node) {
    switch (type) {
      case ContextMenuItemsEnum.RemoteConnection: {
        // TODO: ip address of the sandbox?
        this.sandboxService.establishRemoteConnection(node.name, node.nodeInterfaces[0].address4);
        break;
      }
      case ContextMenuItemsEnum.Start: {
        this.hostService.start('scenario', node.name);
        break;
      }
      case ContextMenuItemsEnum.Restart: {
        this.hostService.restart('scenario', node.name);
        break;
      }
      case ContextMenuItemsEnum.CreateRunningSnapshot: {
        this.sandboxService.createRunningSnapshot('scenario');
        break;
      }
      case ContextMenuItemsEnum.RevertRunningSnapshot: {
        this.sandboxService.revertRunningSnapshot('scenario');
        break;
      }
      default: {
        console.error('No such choice int the graph context menu');
      }
    }
  }
}
