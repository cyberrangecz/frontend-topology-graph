import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SandboxService} from './sandbox.service';
import {concatMap} from 'rxjs/operators';
import {TopologyFacade} from './topology-facade.service';
import {NodeActionEnum} from '../model/enums/node-context-menu-items-enum';

/**
 * Layer between components and API. Handles actions on host nodes
 */
@Injectable()
export class HostService {

  constructor(private topologyFacade: TopologyFacade,
              private sandboxService: SandboxService) {
  }

  /**
   * Resolves type of action and calls api service to handle the action
   * @param type type of requested action
   * @param vmName name of virtual machine (host node)
   */
  performAction(type: NodeActionEnum, vmName: string): Observable<any> {
    switch (type) {
      case NodeActionEnum.GenerateConsoleUrl: {
        return this.getConsoleUrl(vmName);
      }
      case NodeActionEnum.Resume: {
        return this.resume(vmName);
      }
      case NodeActionEnum.Reboot: {
        return this.reboot(vmName);
      }
      case NodeActionEnum.Suspend: {
        return this.suspend(vmName);
      }
      default: {
        console.error('No such choice int the graph context menu');
      }
    }
  }

  /**
   * Returns url of console remote access of host node
   * @param vmName virtual machine name of the host node
   */
  getConsoleUrl(vmName: string): Observable<string> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.getVMConsoleUrl(sandboxId, vmName))
      );
  }

  /**
   * Calls API service to resume host
   * @param vmName name of a host which should be resumed
   */
  resume(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Resume.toLowerCase()))
      );
  }

  /**
   * Calls API service to reboot host
   * @param vmName name of a host which should be rebooted
   */
  reboot(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Reboot.toLowerCase()))
      );
  }

  /**
   * Calls API service to suspend host
   * @param vmName name of a host for which should be suspended
   */
  suspend(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Suspend.toLowerCase()))
      );
  }
}

