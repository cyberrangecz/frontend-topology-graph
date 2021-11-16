import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SandboxService} from './sandbox.service';
import {concatMap} from 'rxjs/operators';
import {TopologyApi} from './topology-api.service';
import {NodeActionEnum} from '../model/enums/node-context-menu-items-enum';
import {UserInterface} from "../model/enums/user-interface-enum";

/**
 * Layer between components and API. Handles actions on host nodes
 */
@Injectable()
export class HostService {

  constructor(private topologyFacade: TopologyApi,
              private sandboxService: SandboxService) {
  }

  /**
   * Resolves type of action and calls api service to handle the action
   * The "Reboot" and "Suspend" actions are not available in the context menu - consider their full removal?
   * @param type type of requested action
   * @param vmIp ip address of the vm to remotely access
   * @param vmName name of virtual machine (host node)
   */
  performAction(type: NodeActionEnum, vmName: string, vmIp: string): Observable<any> {
    switch (type) {
      case NodeActionEnum.GenerateConsoleUrl: {
        return this.getConsoleUrl(vmName);
      }
      case NodeActionEnum.CommandLineInterface: {
        return this.openGuacamoleRemoteConnection(vmName, vmIp, UserInterface.CLI);
      }
      case NodeActionEnum.GraphicalUserInterface: {
        return this.openGuacamoleRemoteConnection(vmName, vmIp, UserInterface.GUI);
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
   * Redirect to the Guacamole web client to get remote desktop access using SSH, VNC or RDP
   * @param vmName virtual machine name of the host node
   * @param vmIp ip address of the vm to remotely access
   * @param userInterface type of the user interface which should be used to open remote connection
   */
  openGuacamoleRemoteConnection(vmName: string, vmIp: string, userInterface: UserInterface): Observable<string> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.establishGuacamoleRemoteConnection(sandboxId, vmName, vmIp, userInterface))
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

