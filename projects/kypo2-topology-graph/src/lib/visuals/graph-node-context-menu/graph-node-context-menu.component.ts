import {Component, HostListener, Input, OnInit} from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';
import {Node} from '@muni-kypo-crp/topology-model';
import {take} from 'rxjs/operators';
import {NodeActionEnum} from '../../model/enums/node-context-menu-items-enum';

/**
 * Visual component for displaying context meu of node after right click
 */
@Component({
  selector: '[context]',
  templateUrl: './graph-node-context-menu.component.html',
  styleUrls: ['./graph-node-context-menu.component.css'],
})
export class NodeContextMenuComponent implements OnInit {

  @Input('context') node: Node;

  isDisplayed = false;
  items;
  consoleButtonDisplayed = false;
  consoleURL = null;

  private menuLocation: { left: number, top: number } = { left: 0, top: 0 };

  constructor(private contextMenuService: ContextMenuService) {
  }

  ngOnInit() {
    this.contextMenuService.show.subscribe(e => this.showMenu(e.position, e.nodeName));
    this.items = this.contextMenuService.getItems();
  }

  /**
   * Changes internal state of the component to reset after user clicked outside the context menu
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event) {
      this.isDisplayed = false;
      this.consoleButtonDisplayed = false;
      this.consoleURL = false;
  }

  /**
   * Calls appropriate service based on value which was chosen by user
   * @param type of menu item user clicked on
   */
  onItemClick(event, item) {
    if (item.type === NodeActionEnum.GenerateConsoleUrl) {
      event.stopPropagation();
      this.consoleButtonDisplayed = true;
    }
    this.contextMenuService.handleMenuItem(item.type, this.node)
      .pipe(
        take(1)
      ).subscribe(result => {
        if (result.type === NodeActionEnum.GenerateConsoleUrl) {
          this.consoleURL = result.payload;
        }
      }
  );
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
    } else {
      this.isDisplayed = false;
    }
  }

}
