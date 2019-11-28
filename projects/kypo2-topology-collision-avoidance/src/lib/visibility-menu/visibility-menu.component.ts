import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'lib-visibility-menu',
  templateUrl: './visibility-menu.component.html',
  styleUrls: ['./visibility-menu.component.css']
})
export class VisibilityMenuComponent implements OnInit {

  nodeToNode: boolean;
  nodeToLink: boolean;
  linkToNode: boolean;
  linkToLink: boolean;
  subnetToNode: boolean;
  subnetToLink: boolean;
  linkToHost: boolean;
  colors: boolean;
  colSwitch: boolean;
  debugSwitch: boolean;


  constructor(private data: SettingsService) { }

  ngOnInit() {
    this.data.getNodeToNode().subscribe(nodeToNode => { this.nodeToNode = nodeToNode; } );
    this.data.getNodeToLink().subscribe(nodeToLink => { this.nodeToLink = nodeToLink; } );
    this.data.getLinkToNode().subscribe(linkToNode => { this.linkToNode = linkToNode; } );
    this.data.getLinkToLink().subscribe(linkToLink => { this.linkToLink = linkToLink; } );
    this.data.getSubnetToNode().subscribe(subnetToNode => { this.subnetToNode = subnetToNode; } );
    this.data.getSubnetToLink().subscribe(subnetToLink => { this.subnetToLink = subnetToLink; } );
    this.data.getLinkToHost().subscribe(linkToHost => { this.linkToHost = linkToHost; } );
    this.data.getColors().subscribe(colors => { this.colors = colors; } );
    this.data.getColSwitch().subscribe(colSwitch => { this.colSwitch = colSwitch; } );
  }

  toggleNodeToNode() {
    if (this.nodeToNode) {
      this.data.changeNodeToNode(false);
    } else {
      this.data.changeNodeToNode(true);
    }
  }
  toggleNodeToLink() {
    if (this.nodeToLink) {
      this.data.changeNodeToLink(false);
    } else {
      this.data.changeNodeToLink(true);
    }
  }
  toggleLinkToNode() {
    if (this.linkToNode) {
      this.data.changeLinkToNode(false);
    } else {
      this.data.changeLinkToNode(true);
    }
  }
  toggleLinkToLink() {
    if (this.linkToLink) {
      this.data.changeLinkToLink(false);
    } else {
      this.data.changeLinkToLink(true);
    }
  }
  toggleSubnetToNode() {
    if (this.subnetToNode) {
      this.data.changeSubnetToNode(false);
    } else {
      this.data.changeSubnetToNode(true);
    }
  }
  toggleSubnetToLink() {
    if (this.subnetToLink) {
      this.data.changeSubnetToLink(false);
    } else {
      this.data.changeSubnetToLink(true);
    }
  }
  toggleLinkToHost() {
    if (this.linkToHost) {
      this.data.changeLinkToHost(false);
    } else {
      this.data.changeLinkToHost(true);
    }
  }
  toggleColors() {
    if (this.colors) {
      this.data.changeColors(false);
      this.data.changeNodeToNode(true);
      this.data.changeNodeToLink(true);
      this.data.changeLinkToNode(true);
      this.data.changeLinkToLink(true);
      this.data.changeSubnetToNode(true);
      this.data.changeLinkToHost(true);
      this.data.changeSubnetToLink(true);
    } else {
      this.data.changeColors(true);
    }
  }
  toggleColSwitch() {
    if (this.colSwitch) {
      this.data.changeColSwitch(false);
      this.data.changeNodeToNode(false);
      this.data.changeNodeToLink(false);
      this.data.changeLinkToNode(false);
      this.data.changeLinkToLink(false);
      this.data.changeSubnetToNode(false);
      this.data.changeLinkToHost(false);
      this.data.changeColors(false);
      this.data.changeSubnetToLink(false);
    } else {
      this.data.changeColSwitch(true);
      this.data.changeNodeToNode(true);
      this.data.changeNodeToLink(true);
      this.data.changeLinkToNode(true);
      this.data.changeLinkToLink(true);
      this.data.changeSubnetToNode(true);
      this.data.changeLinkToHost(true);
      this.data.changeSubnetToLink(true);
      this.data.changeColors(false);
    }
  }
}
