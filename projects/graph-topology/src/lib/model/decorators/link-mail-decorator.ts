import {LinkDecorator} from './link-decorator';

export class LinkMailDecorator extends LinkDecorator {

  amount: number;

  constructor(linkName: string, amount: number) {
    super(linkName);
    this.amount = amount;
  }
}
