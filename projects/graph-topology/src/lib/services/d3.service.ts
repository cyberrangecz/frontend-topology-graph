import { Injectable } from '@angular/core';
import { ForceDirectedGraph } from '../model/graph/force-directed-graph';
import { Link } from 'graph-topology-model-lib';
import { Node} from 'graph-topology-model-lib';
import * as d3 from 'd3';
import {NodePhysicalRoleEnum} from 'graph-topology-model-lib';
import {RouterNode} from 'graph-topology-model-lib';
import {D3ZoomEventService} from './d3-zoom-event.service';
import {GraphLockService} from './graph-lock.service';
import {Subject, Observable} from 'rxjs';
import {DraggedNodeService} from './dragged-node.service';

/**
 * Service used for interaction between D3 library events and visual components through directives.
 */
@Injectable()
export class D3Service {

  private zoomSvg;
  private zoomContainer;
  private zoom;

  private currentScale;

  private _resizeEventSubject: Subject<{x: number, y: number}> = new Subject<{x: number, y: number}>();
  resizeEvent: Observable<{x: number, y: number}> = this._resizeEventSubject.asObservable();

  constructor(private d3ZoomEventService: D3ZoomEventService,
              private draggedNodeService: DraggedNodeService,
              private graphLockService: GraphLockService) {

  }

  /**
   * Resets selected svg to default position and zoom
   */
  resetZoom() {
    this.zoom.transform(this.zoomSvg, d3.zoomIdentity);
    this.currentScale = 1;
  }

  zoomIn() {
    this.currentScale += 0.1;
    this.zoomContainer.attr('transform', 'scale(' + this.currentScale + ')');
    this.d3ZoomEventService.triggerZoomChange(this.currentScale);

  }

  zoomOut() {
    this.currentScale -= 0.1;
    this.zoomContainer.attr('transform', 'scale(' + this.currentScale + ')');
    this.d3ZoomEventService.triggerZoomChange(this.currentScale);
  }

  /**
   * Binds selected element to custom zooming behaviour
   * @param svgElement svg element to bind
   * @param containerElement container of svg element
   * @param graph to be added
   */
  applyZoomableBehaviour(svgElement, containerElement, graph: ForceDirectedGraph) {
    this.zoomContainer = d3.select(containerElement);
    this.zoomSvg = d3.select(svgElement);
    this.currentScale = 1;
    // sets custom anon function to d3.zoom call
    this.zoom = d3.zoom()
      .on('zoom', () => {
        if (!this.graphLockService.getLocked()) {
          const transform = d3.event.transform;
          this.zoomContainer.attr('transform', 'scale(' + transform.k + ')');

          // triggers event to notify subscribers about zooming
          this.d3ZoomEventService.triggerZoomChange(transform.k);
          this.currentScale = transform.k;

          // allow panning only when zoomed in
          if (transform.k <= 1) {
            this.zoomSvg.on('mousedown.zoom', null);
          } else {
            this.zoomSvg.on('mousedown.zoom', defaultMouseDownListener);
          }
        }
      })
      .scaleExtent([0.1, 5])
      .filter(() => {
        return d3.event.shiftKey;
      });

    // prevents zooming on double click which is already assigned to revealing subnetworks
    this.zoomSvg.call(this.zoom)
      .on('scroll', null)
      .on('dblclick.zoom', null);

    // prevents panning
    const defaultMouseDownListener = this.zoomSvg.on('mousedown.zoom');
    this.zoomSvg.on('mousedown.zoom', null);


  }

  /**
   * Applies dragging from D3 library on selected node.
   * If selected node is router it recalculates position for its subnetwork recursively.
   * @param element selected by user
   * @param {Node} node selected node
   * @param {ForceDirectedGraph} graph
   */
  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);
    const lockService = this.graphLockService;
    const resizeEventSubject = this._resizeEventSubject;
    const dragService = this.draggedNodeService;
    // drag started by user
    function started() {
      dragService.emitNodeTouchedEvent(node);
      // since d3 v4.13.0 default propagation to parent needs to be stopped
      d3.event.sourceEvent.stopPropagation();
      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      node.fx = node.x;
      node.fy = node.y;

      // starting dragging on all children nodes for moving subnetworks as a whole
      if (node instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
        dragStartedSubnetwork(node);
      }

      d3.event.on('drag', dragged).on('end', ended);

      // recursive function to start dragging on all nodes in parent subnetwork
      function dragStartedSubnetwork(router) {
        for (const child of router.children) {
          child.fx = child.x;
          child.fy = child.y;

          if (child instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
            dragStartedSubnetwork(child);
          }
        }
      }

      // node is dragged, its position is recalculated here
      function dragged() {
        if (dragService.lastDraggedNodeId !== node.id) {
          dragService.emitNodeDragStartedEvent(node);
        }

        if (lockService.getLocked()) {
          // prevents dragging outside the window
          node.fx = Math.max(50, Math.min(graph.getGraphWidth() - 50, d3.event.x));
          node.fy =  Math.max(50, Math.min(graph.getGraphHeight() - 50, d3.event.y));

          // detects if parent node is on the border of window and stops dragging of subnet
          const onBorder = node.fx <= 50
            || node.fx >= graph.getGraphWidth() - 50
            || node.fy <= 50
            || node.fy >= graph.getGraphHeight() - 50;
          // calculation made also on children nodes to maintain distances inside subnetwork
          if (!onBorder && node instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
            draggedSubnetwork(node);
          }
        } else {
          node.fx = d3.event.x;
          node.fy = d3.event.y;

          const outside = node.fx <= 50
            || node.fx >= graph.getGraphWidth() - 50
            || node.fy <= 50
            || node.fy >= graph.getGraphHeight() - 100;

          // event to resize the window in unlocked mode
          if (outside) {
            resizeEventSubject.next({x: node.fx, y: node.fy});
          }
          if (node instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
            draggedSubnetwork(node);
          }
        }

        //  recursive function to recalculate position of all nodes in parent subnetwork
        function draggedSubnetwork(router) {
          for (const child of router.children) {

            if (lockService.getLocked()) {
              // prevents dragging outside the window
              child.fx = Math.max(50, Math.min(graph.getGraphWidth() - 50, d3.event.x + (child.x - node.x)));
              child.fy = Math.max(50, Math.min(graph.getGraphHeight() - 50, d3.event.y + (child.y - node.y)));
            } else {
              child.fx = d3.event.x + (child.x - node.x);
              child.fy = d3.event.y + (child.y - node.y);
            }
              if (child instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
                draggedSubnetwork(child);
            }
          }
        }
      }

      // dragging is stopped by user
      function ended() {
        if (dragService.lastDraggedNodeId === node.id) {
          dragService.emitNodeDragEndedEvent();
        }

        if (!d3.event.active) {
          graph.simulation.alphaTarget(0).restart();
        }
        node.fx = null;
        node.fy = null;

        // clear children nodes attributes
        if (node instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
          dragEndSubnetwork(node);
        }

        // recursively clean attributes of all nodes in parent's subnetwork
        function dragEndSubnetwork(router) {
          for (const child of router.children) {
            child.fx = null;
            child.fy = null;

            if (child instanceof RouterNode && node.physicalRole === NodePhysicalRoleEnum.Router) {
              dragEndSubnetwork(child);
            }
          }
        }
      }
    }

    // initiate chain of functions responsible for dragging behaviour
    d3element.call(d3.drag().on('start', started));
  }

  /**
   * creates force directed graph-visual object on startup
   * @param {Node[]} nodes every node of graph-visual
   * @param {Link[]} links every link of graph-visual
   * @param {{width; height}} options width and height of svg
   * @returns {ForceDirectedGraph} created object of D3 graph-visual
   */
  createForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
     return new ForceDirectedGraph(nodes, links, options);
  }
}
