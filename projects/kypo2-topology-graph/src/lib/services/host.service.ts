import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SandboxService } from './sandbox.service';
import { concatMap } from 'rxjs/operators';
import { TopologyApi } from './topology-api.service';
import { NodeActionEnum } from '../model/enums/node-context-menu-items-enum';
import { UserInterface } from '../model/enums/user-interface-enum';
import { HostNode, RouterNode } from '@muni-kypo-crp/topology-model';
import { ConsoleUrl } from '../model/others/console-url';

/**
 * Layer between components and API. Handles actions on host nodes
 */
@Injectable()
export class HostService {
  constructor(private topologyFacade: TopologyApi, private sandboxService: SandboxService) {}

  /**
   * Resolves type of action and calls api service to handle the action
   * The "Reboot" and "Suspend" actions are not available in the context menu - consider their full removal?
   * @param type type of requested action
   * @param node host node
   */
  performAction(type: NodeActionEnum, node: HostNode | RouterNode): Observable<any> {
    switch (type) {
      case NodeActionEnum.OpenConsoleUrl: {
        return this.getConsoleUrl(node.name);
      }
      case NodeActionEnum.CommandLineInterface: {
        return this.openGuacamoleRemoteConnection(node.nodePorts[0].ip, node.osType, UserInterface.CLI);
      }
      case NodeActionEnum.GraphicalUserInterface: {
        return this.openGuacamoleRemoteConnection(node.nodePorts[0].ip, node.osType, UserInterface.GUI);
      }
      case NodeActionEnum.Resume: {
        return this.resume(node.name);
      }
      case NodeActionEnum.Reboot: {
        return this.reboot(node.name);
      }
      case NodeActionEnum.Suspend: {
        return this.suspend(node.name);
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
    const consoles = window.localStorage.getItem('vm-consoles');
    if (consoles) {
      const data = JSON.parse(consoles) as ConsoleUrl[];
      const vmConsole = data.find((console) => console.name === vmName);
      if (vmConsole) {
        return of(vmConsole.url);
      }
    } else {
      return this.sandboxService.sandboxId$.pipe(
        concatMap((sandboxId) => this.topologyFacade.getVMConsoleUrl(sandboxId, vmName))
      );
    }
  }

  /**
   * Redirect to the Guacamole web client to get remote desktop access using SSH, VNC or RDP
   * @param vmIp ip address of the vm to remotely access
   * @param vmOsType vm's OS type of the host node
   * @param userInterface type of the user interface which should be used to open remote connection
   */
  openGuacamoleRemoteConnection(vmIp: string, vmOsType: string, userInterface: UserInterface): Observable<string> {
    return this.sandboxService.sandboxId$.pipe(
      concatMap((sandboxId) =>
        this.topologyFacade.establishGuacamoleRemoteConnection(sandboxId, vmIp, vmOsType, userInterface)
      )
    );
  }

  /**
   * Calls API service to resume host
   * @param vmName name of a host which should be resumed
   */
  resume(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$.pipe(
      concatMap((sandboxId) =>
        this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Resume.toLowerCase())
      )
    );
  }

  /**
   * Calls API service to reboot host
   * @param vmName name of a host which should be rebooted
   */
  reboot(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$.pipe(
      concatMap((sandboxId) =>
        this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Reboot.toLowerCase())
      )
    );
  }

  /**
   * Calls API service to suspend host
   * @param vmName name of a host for which should be suspended
   */
  suspend(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$.pipe(
      concatMap((sandboxId) =>
        this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Suspend.toLowerCase())
      )
    );
  }
}
