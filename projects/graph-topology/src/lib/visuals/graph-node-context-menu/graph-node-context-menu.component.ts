import {Component, Input, OnInit} from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';
import {HostNode, Node} from 'graph-topology-model-lib';
import {Connectable} from 'graph-topology-model-lib/lib/node/connectable';

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

  @Input('context') node: Node;

  isDisplayed: boolean = false;
  items;

  private menuLocation: { left: number, top: number } = { left: 0, top: 0 };

  constructor(private contextMenuService: ContextMenuService) {
  }

  ngOnInit() {
    this.contextMenuService.show.subscribe(e => this.showMenu(e.position, e.nodeName));
    this.items = this.contextMenuService.getItems();
  }

  /**
   * Calls appropriate service based on value which was chosen by user
   * @param type of menu item user clicked on
   */
  onItemClick(item) {
    this.contextMenuService.handleMenuItem(item.type, this.node);
  }

  /**
   * Location parameters of mouse right click
   * @returns {{left: number; top: number}} object describing click location
   */
  get location() {
    return {
      left: this.menuLocation.left,
      top: this.menuLocation.top
    };
  }

  /**
   * Displays menu and all its items
   * @param event sent by context menu service
   * @param items to be shown in menu
   */
  showMenu(position, nodeName) {
    if (this.node.name === nodeName) {
      this.menuLocation = {
        left: position.x,
        top: position.y
      };
      this.isDisplayed = true;
    }
  }

  clickedOutside() {
    this.isDisplayed = false;
  }
}
