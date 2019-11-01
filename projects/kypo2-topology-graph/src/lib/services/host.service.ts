import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {Observable, of} from 'rxjs';
import {SandboxService} from './sandbox.service';
import {concatMap, map} from 'rxjs/operators';
import {TopologyFacade} from './topology-facade.service';
import {NodeActionEnum} from '../model/enums/node-context-menu-items-enum';
import {MenuItemResult} from '../model/events/menu-item-result';

@Injectable()
export class HostService {

  constructor(private topologyFacade: TopologyFacade,
              private sandboxService: SandboxService) {
  }

  performAction(type: NodeActionEnum, vmName: string): Observable<any> {
    switch (type) {
      case NodeActionEnum.GenerateConsoleUrl: {
        return this.getTerminalUrl(vmName);
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

  getTerminalUrl(vmName: string): Observable<string> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.getVMConsole(sandboxId, vmName))
      );
  }

  /**
   * Calls REST API to resume host
   * @param vmName name of a host which should be resumed
   */
  resume(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Resume.toLowerCase()))
      );
  }

  /**
   * Calls REST API to reboot host
   * @param vmName name of a host which should be rebooted
   */
  reboot(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Reboot.toLowerCase()))
      );
  }

  /**
   * Calls REST API to suspend host
   * @param vmName name of a host for which should be suspended
   */
  suspend(vmName: string): Observable<any> {
    return this.sandboxService.sandboxId$
      .pipe(
        concatMap(sandboxId => this.topologyFacade.performVMAction(sandboxId, vmName, NodeActionEnum.Suspend.toLowerCase()))
      );
  }
}

