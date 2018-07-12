import {LinkDecorator} from './link-decorator';

export class LinkMailDecorator extends LinkDecorator {

  amount: number;

  constructor(linkId: number, amount: number) {
    super(linkId);
    this.amount = amount;
  }
}
