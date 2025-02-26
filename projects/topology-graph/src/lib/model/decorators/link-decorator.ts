/**
 * Abstract class of link decorator
 */
export abstract class LinkDecorator {
    linkName: string;

    constructor(linkName: string) {
        this.linkName = linkName;
    }
}
