import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SettingsService {

  private nodeToNode = new BehaviorSubject(true);
  private nodeToLink = new BehaviorSubject(true);
  private linkToNode = new BehaviorSubject(true);
  private linkToLink = new BehaviorSubject(true);
  private subnetToNode = new BehaviorSubject(true);
  private subnetToLink = new BehaviorSubject(true);
  private linkToHost = new BehaviorSubject(true);
  private colors = new BehaviorSubject(false);
  private colSwitch = new BehaviorSubject(false);

  constructor() { }
  
  changeNodeToNode(nodeToNode: boolean) {
    this.nodeToNode.next(nodeToNode);
  }

  changeNodeToLink(nodeToLink: boolean) {
    this.nodeToLink.next(nodeToLink);
  }

  changeLinkToNode(linkToNode: boolean) {
    this.linkToNode.next(linkToNode);
  }

  changeLinkToLink(linkToLink: boolean) {
    this.linkToLink.next(linkToLink);
  }

  changeSubnetToNode(subnetToNode: boolean) {
    this.subnetToNode.next(subnetToNode);
  }

  changeSubnetToLink(subnetToLink: boolean) {
    this.subnetToLink.next(subnetToLink);
  }

  changeLinkToHost(linkToHost: boolean) {
    this.linkToHost.next(linkToHost);
  }

  changeColors(colors: boolean) {
    this.colors.next(colors);
  }

  changeColSwitch(colSwitch: boolean) {
    this.colSwitch.next(colSwitch);
  }

  getNodeToNode() {
    return this.nodeToNode.asObservable();  
  }
  getNodeToLink() {
    return this.nodeToLink.asObservable();  
  }  
  getLinkToNode() {
    return this.linkToNode.asObservable();  
  }  
  getLinkToLink() {
    return this.linkToLink.asObservable();  
  }
  getSubnetToNode() {
    return this.subnetToNode.asObservable();  
  }  
  getSubnetToLink() {
    return this.subnetToLink.asObservable();  
  }
  getLinkToHost() {
    return this.linkToHost.asObservable();  
  }
  getColors() {
    return this.colors.asObservable();  
  }
  getColSwitch() {
    return this.colSwitch.asObservable();  
  }
}
