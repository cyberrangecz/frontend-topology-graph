/**
 * Decorator of links speed.
 */

import { LinkDecorator } from './link-decorator';

export class LinkSpeedDecorator extends LinkDecorator {
  speed: number;

  constructor(linkName: string, speed: number) {
    super(linkName);
    this.speed = speed;
  }
}
