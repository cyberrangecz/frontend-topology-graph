export class NodeInterface {
  id: number;
  nodeId: number;
  address4: string;
  address6: string;


  constructor(id: number, nodeId: number, address4: string, address6: string) {
    this.id = id;
    this.nodeId = nodeId;
    this.address4 = address4;
    this.address6 = address6;
  }

  toString() {
    let result = 'Id: ' + this.id + '\n';
    if (this.address4 !== null &&  this.address4 !== '') {
      result += 'IPv4 address: ' + this.address4 + '\n';
    }
    if (this.address6 !== null && this.address6 !== '') {
      result += 'IPv6 address: ' + this.address6 + '\n';
    }
    return result;
  }
}
