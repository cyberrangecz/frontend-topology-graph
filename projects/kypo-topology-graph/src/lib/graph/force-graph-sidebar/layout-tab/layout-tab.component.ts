import { Component } from '@angular/core';
import { GraphEventService } from '../../../services/graph-event.service';
import { GraphLayoutsEnum } from '../../../model/enums/graph-layouts-enum';
import { GraphLockService } from '../../../services/graph-lock.service';

@Component({
  selector: 'app-layout-tab',
  templateUrl: './layout-tab.component.html',
  styleUrls: ['./layout-tab.component.css'],
})
export class LayoutTabComponent {
  layouts: GraphLayoutsEnum[];
  activeLayout;

  layoutDisabled = true;
  lockedGraph = true;

  constructor(
    private graphEventService: GraphEventService,
    private graphLockService: GraphLockService,
  ) {
    this.layouts = Object.values(GraphLayoutsEnum);
  }

  /*  /!**
     * Turns on/off layouts
     *!/
    toggleLayouts() {
      this.layoutDisabled = !this.layoutDisabled;
      if (this.layoutDisabled) {
        this.disableLayouts();
      } else {
        this.setActiveLayout(this.activeLayout);
      }
    }*/

  /**
   * Locks and unlocks the graph canvas size
   */
  toggleLock() {
    this.lockedGraph = !this.lockedGraph;
    if (this.lockedGraph) {
      this.lockGraph();
    } else {
      this.unlockGraph();
    }
  }

  unlockGraph() {
    this.graphLockService.unlock();
  }

  lockGraph() {
    this.graphLockService.lock();
  }

  /**
   * disables layout
   */

  /*  private disableLayouts() {
      this.activeLayout = null;
      this.graphEventService.turnOffForces();
    }

    /!**
     * Sets current active layout
     * @param activeLayout a layout which should be set as active
     *!/
    setActiveLayout(activeLayout) {
      this.graphEventService.turnOffForces();
      switch (activeLayout) {
        case GraphLayoutsEnum.Hierarchical: {
          this.graphEventService.hierarchicalLayout();
          break;
        }
        default:
          break;
      }
    }*/

  /**
   * Collapses all nodes
   */
  collapseAll() {
    this.graphEventService.collapseAll();
  }

  /**
   * Expands all nodes
   */
  expandAll() {
    this.graphEventService.expandAll();
  }
}
