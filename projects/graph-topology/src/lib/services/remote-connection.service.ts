import {Injectable} from '@angular/core';
import {SpiceClientService} from 'spice-client-lib';

@Injectable()
export class RemoteConnectionService {

  constructor(private spice: SpiceClientService) {

  }

  /**
   * Establishes remote connection with a node through spice client
   * @param nodeId id of a node
   */
  establishConnection(nodeId: number) {
    this.spice.openClient({
      sandboxName: 'test',
      machineName: 'test'
    });
  }
}
