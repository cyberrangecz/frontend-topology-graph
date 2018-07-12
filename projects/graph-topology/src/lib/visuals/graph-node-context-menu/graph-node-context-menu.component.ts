import { Component, Input, OnInit } from '@angular/core';
import { GraphNodeVisualComponent } from '../graph-node-visual/graph-node-visual.component';
import { ContextMenuService } from '../../services/context-menu.service';
import {ContextMenuItemsEnum} from '../../model/enums/node-context-menu-items-enum';

/**
 * Visual component for displaying context meu of node after right click
 */
@Component({
  selector: '[context]',
  templateUrl: './graph-node-context-menu.component.html',
  styleUrls: ['./graph-node-context-menu.component.css'],
  host: {
    '(document:click)': 'clickedOutside()'
  }
})
export class NodeContextMenuComponent implements OnInit {

  @Input('context') node: GraphNodeVisualComponent;

  private mouseLocation: { left: number, top: number} = {left: 0, top: 0};

  constructor(private contextMenuService: ContextMenuService) {
    contextMenuService.show.subscribe(e => this.showMenu(e.event, e.obj));
  }

  ngOnInit() {
    this.node.contextMenuItems
      .forEach(l => l.subject
        .subscribe(val => this.contextMenuCallback(val)));
  }

  /**
   * Calls appropriate service based on value which was chosen by user
   * @param type of menu item user clicked on
   */
  contextMenuCallback(type) {
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

  /**
   * Location parameters of mouse right click
   * @returns {{left: number; top: number}} object describing click location
   */
  get location(){
    return {
      left: this.mouseLocation.left,
      top: this.mouseLocation.top
    };
  }

  /**
   * Displays menu and all its items
   * @param event sent by context menu service
   * @param items to be shown in menu
   */
  showMenu(event, items) {
    this.node.contextMenuItems = items;
    this.mouseLocation = {
      left: event.clientX,
      top: event.clientY
    };
  }

  /**
   * Detection of click outside of shown context menu
   */
  clickedOutside() {
    this.node.showContextMenu = false;
  }
}
