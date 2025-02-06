import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-topology-page',
    templateUrl: './topology-page.component.html',
    styleUrls: ['./topology-page.component.css']
})
export class TopologyPageComponent {
    topologyWidth: number = window.innerWidth / 1.5;
    topologyHeight: number = window.innerHeight / 1.8;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.topologyWidth = event.target.innerWidth / 1.5;
        this.topologyHeight = event.target.innerHeight / 1.8;
    }

    topologyLoadingFinished($event) {
    }
}
