import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { HostNode, RouterNode } from '@muni-kypo-crp/topology-model';
import { take } from 'rxjs/operators';
import { NodeActionEnum } from '../../model/enums/node-context-menu-items-enum';
import { ConfigService } from '../../services/config.service';
import { HostService } from '../../services/host.service';

/**
 * Visual component for displaying context meu of node after right click
 */
@Component({
  selector: '[context]',
  templateUrl: './graph-node-context-menu.component.html',
  styleUrls: ['./graph-node-context-menu.component.css'],
})
export class NodeContextMenuComponent implements OnInit {
  @Input() node: HostNode | RouterNode;
  @Input() cloudSandboxInstance: boolean;

  isDisplayed = false;
  items;
  consoleButtonDisplayed = false;
  consoleURL = null;

  private menuLocation: { left: number; top: number } = { left: 0, top: 0 };

  constructor(
    private contextMenuService: ContextMenuService,
    private configService: ConfigService,
    private hostService: HostService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    this.contextMenuService.show.subscribe((e) => this.showMenu(e.position, e.nodeName));
    if (this.cloudSandboxInstance) {
      this.items = this.contextMenuService.getItems().filter((item) => {
        if (item.type === NodeActionEnum.CommandLineInterface) {
          return this.node.osType === 'linux';
        } else if (item.type === NodeActionEnum.GraphicalUserInterface) {
          return this.node.guiAccess;
        }
        return true;
      });
    } else {
      this.items = this.contextMenuService.getItems().filter((item) => {
        return item.type === NodeActionEnum.CopyHostInfo;
      });
    }
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
    if (item.type === NodeActionEnum.CopyHostInfo) {
      this.clipboard.copy(this.node.toString());
      return;
    }

    this.contextMenuService
      .handleMenuItem(item.type, this.node)
      .pipe(take(1))
      .subscribe((result) => {
        if (
          result.type === NodeActionEnum.CommandLineInterface ||
          result.type === NodeActionEnum.GraphicalUserInterface
        ) {
          const clientIdentifier = window.btoa([result.payload, 'c', 'quickconnect'].join('\0'));
          window.open(`${this.configService.config.guacamoleConfig.url}#/client/${clientIdentifier}`, '_blank');
        }
      });
  }

  /**
   * Location parameters of mouse right click
   * @returns {{left: number; top: number}} object describing click location
   */
  get location() {
    return {
      left: this.menuLocation.left,
      top: this.menuLocation.top,
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
        top: position.y,
      };
      this.isDisplayed = true;
      if (this.cloudSandboxInstance) {
        this.hostService.getConsoleUrl(this.node.name).subscribe((url) => (this.consoleURL = url));
      }
    } else {
      this.isDisplayed = false;
    }
  }
}
