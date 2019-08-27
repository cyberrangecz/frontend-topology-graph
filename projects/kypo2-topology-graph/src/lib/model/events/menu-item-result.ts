import {ContextMenuItemsEnum} from '../enums/node-context-menu-items-enum';

export class MenuItemResult {
  type: ContextMenuItemsEnum;
  payload: any;

  constructor(type: ContextMenuItemsEnum, payload: any) {
    this.type = type;
    this.payload = payload;
  }
}
