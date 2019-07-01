import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { D3Service } from '../services/d3.service';
import {ForceDirectedGraph} from '../model/graph/force-directed-graph';

/**
 * Directive for marking objects that should be zoomed.
 */
@Directive({
  selector: '[zoomableOf]'
})
export class ZoomableDirective implements OnInit {
  @Input('zoomableOf') containerElement: ElementRef;
  @Input('zoomableIn') graph: ForceDirectedGraph;

  constructor(private d3Service: D3Service,
              private _element: ElementRef) {}

  ngOnInit() {
    this.d3Service.applyZoomableBehaviour(this.containerElement, this._element.nativeElement, this.graph);
  }
}
