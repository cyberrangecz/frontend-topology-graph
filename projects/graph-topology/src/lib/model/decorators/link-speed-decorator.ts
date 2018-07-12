/**
 * Decorator of links speed.
 */

import { LinkDecorator } from './link-decorator';

export class LinkSpeedDecorator extends LinkDecorator {
  speed: number;

  constructor(linkId: number, speed: number) {
    super(linkId);
    this.speed = speed;
  }
}
