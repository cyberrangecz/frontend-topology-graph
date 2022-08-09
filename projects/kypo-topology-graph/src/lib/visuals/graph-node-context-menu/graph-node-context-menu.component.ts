import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { HostNode, RouterNode } from '@muni-kypo-crp/topology-model';
import { take } from 'rxjs/operators';
import { NodeActionEnum } from '../../model/enums/node-context-menu-items-enum';
import { ConfigService } from '../../services/config.service';
import { HostService } from '../../services/host.service';
import { Dimensions } from '../../model/others/dimensions';

/**
 * Visual component for displaying context meu of node after right click
 */
@Component({
  selector: '[context]',
  templateUrl: './graph-node-context-menu.component.html',
  styleUrls: ['./graph-node-context-menu.component.css'],
})
export class NodeContextMenuComponent implements OnInit, OnChanges {
  readonly MENU_ROW_HEIGHT = 20;
  MENU_ROW_WIDTH = 160;

  @Input() node: HostNode | RouterNode;
  @Input() cloudSandboxInstance: boolean;
  @Input() graphSize: Dimensions;
  @Input() isConsoleReady: boolean;
  @Output() loadConsoles: EventEmitter<string> = new EventEmitter();
  @Output() polling: EventEmitter<boolean> = new EventEmitter();

  isDisplayed = false;
  items;
  consoleButtonDisplayed = false;

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

  ngOnChanges(changes: SimpleChanges) {
    if ('isConsoleReady' in changes) {
      this.MENU_ROW_WIDTH = this.isConsoleReady ? 160 : 200;
    }
  }

  /**
   * Changes internal state of the component to reset after user clicked outside the context menu
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event) {
    if (this.isDisplayed) {
      this.polling.emit(false);
    }
    this.isDisplayed = false;
    this.consoleButtonDisplayed = false;
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
    if (item.type === NodeActionEnum.OpenConsoleUrl && !this.isConsoleReady) {
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
        } else if (result.type === NodeActionEnum.OpenConsoleUrl) {
          window.open(result.payload, '_blank');
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
        left:
          position.x + this.MENU_ROW_WIDTH > this.graphSize.width
            ? this.graphSize.width - this.MENU_ROW_WIDTH
            : position.x,
        top:
          position.y + this.MENU_ROW_HEIGHT * this.items.length > this.graphSize.height
            ? this.graphSize.height - this.MENU_ROW_HEIGHT * this.items.length
            : position.y,
      };
      this.isDisplayed = true;
      if (this.cloudSandboxInstance) {
        this.loadConsoles.emit(this.node.name);
      }
    } else {
      this.isDisplayed = false;
    }
  }
}
