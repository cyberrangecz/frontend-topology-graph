/**
 * Abstract class of link decorator
 */
export abstract class LinkDecorator {
  linkId: number;

  constructor(linkId: number) {
    this.linkId = linkId;
  }
}
