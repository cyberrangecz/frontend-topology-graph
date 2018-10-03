import {TestBed} from '@angular/core/testing';
import {GraphTopologyLoaderService} from '../graph-topology-loader.service';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {HttpClient} from '@angular/common/http';
import {asyncData} from '../../testing/async-observable-helpers';
import {RouterNode} from 'graph-topology-model-lib';
import {NodePhysicalRoleEnum} from 'graph-topology-model-lib';
import {HostNode} from 'graph-topology-model-lib';
import {NodeInterface} from 'graph-topology-model-lib';
import {Link} from 'graph-topology-model-lib';
import {LinkTypeEnum} from 'graph-topology-model-lib';
import {emptyTopology, multipleInterfaces, simpleTopology} from '../../testing/topology-test-jsons';


let loaderService: GraphTopologyLoaderService;
let httpClientSpy: { get: jasmine.Spy };

describe('Graph topology loader service', () => {
  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        GraphTopologyLoaderService,
        {provide: HttpClient, useValue: httpClientSpy}
      ]
    });

    loaderService = TestBed.get(GraphTopologyLoaderService);
  });

  it('should have called http get one time', () => {
    httpClientSpy.get.and.returnValue(asyncData(emptyTopology));
    loaderService.getTopology('test').subscribe(
      topology => {
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      }
    );
  });

  it('should have loaded nodes with correct attributes', () => {
    httpClientSpy.get.and.returnValue(asyncData(simpleTopology));
    const expectedRouter = new RouterNode(1, NodePhysicalRoleEnum.Router, 'router');
    const expectedHost = new HostNode(2, NodePhysicalRoleEnum.Desktop, 'pc');

    loaderService.getTopology('test').subscribe(
      topology => {
        expect(topology.nodes).not.toBeNull('node array should not be null');
        expect(topology.nodes).not.toBeUndefined('node array should not be undefined');
        expect(topology.nodes.length).toEqual(2, 'node array should have two elements');

        const actualRouter = topology.nodes[0];
        expect(actualRouter.id).toEqual(expectedRouter.id,
          'expected router id to be: ' + expectedRouter.id + ' but it is: ' + actualRouter.id);
        expect(actualRouter.physicalRole).toEqual(expectedRouter.physicalRole,
          'expected router physical role to be: ' + expectedRouter.id + ' but it is: ' + actualRouter.id);
        expect(actualRouter.name).toEqual(expectedRouter.name,
          'expected router name to be: ' + expectedRouter.id + ' but it is: ' + actualRouter.id);

        const actualHost = topology.nodes[1];
        expect(actualHost.id).toEqual(expectedHost.id,
          'expected host id to be: ' + expectedHost.id + ' but it is: ' + actualHost.id);
        expect(actualHost.physicalRole).toEqual(expectedHost.physicalRole,
          'expected host physical role to be: ' + expectedHost.physicalRole + ' but it is: ' + actualHost.physicalRole);
        expect(actualHost.name).toEqual(expectedHost.name,
          'expected host name to be: ' + expectedHost.name + ' but it is: ' + actualHost.name);
      }
    );
  });

  it('should have created instances of correct types of nodes', () => {
    httpClientSpy.get.and.returnValue(asyncData(simpleTopology));

    loaderService.getTopology('test').subscribe(
      topology => {
        const actualRouter = topology.nodes[0];
        expect(actualRouter instanceof RouterNode).toBeTruthy('router node is not an instance of RouterNode class');
        const actualHost = topology.nodes[1];
        expect(actualHost instanceof HostNode).toBeTruthy('host node is not an instance of HostNode class');
      }
    );
  });

  it('should have loaded interfaces with correct attributes', () => {
    httpClientSpy.get.and.returnValue(asyncData(simpleTopology));
    const expectedRouterInterface = new NodeInterface(3, 1, '150.150.2.2', 'e80::1ff:fe23:4567:890b');
    const expectedHostInterface = new NodeInterface(4, 2, '150.150.2.1', 'e80::1ff:fe23:4567:890a');

    loaderService.getTopology('test').subscribe(
      topology => {
        const actualRouter = topology.nodes[0];
        expect(actualRouter.nodeInterfaces).not.toBeNull('router interfaces should not be null');
        expect(actualRouter.nodeInterfaces).not.toBeUndefined('router interfaces should not be undefined');
        expect(actualRouter.nodeInterfaces.length).toEqual(1, 'router interfaces should be of length 1');

        expect(actualRouter.nodeInterfaces[0].id).toEqual(expectedRouterInterface.id,
          'expected router interface id to be: ' + expectedRouterInterface.id + ' but it is: ' + actualRouter.nodeInterfaces[0].id);
        expect(actualRouter.nodeInterfaces[0].address4).toEqual(expectedRouterInterface.address4,
          'expected router interface ipv4 address to be: ' + expectedRouterInterface.address4 + ' but it is: ' + actualRouter.nodeInterfaces[0].address4);
        expect(actualRouter.nodeInterfaces[0].address6).toEqual(expectedRouterInterface.address6,
          'expected router interface ipv6 address to be: ' + expectedRouterInterface.address6 + ' but it is: ' + actualRouter.nodeInterfaces[0].address6);

        const actualHost = topology.nodes[1];
        expect(actualHost.nodeInterfaces).not.toBeNull('host interfaces should not be null');
        expect(actualHost.nodeInterfaces).not.toBeUndefined('host interfaces should not be undefined');
        expect(actualHost.nodeInterfaces.length).toEqual(1, 'host interfaces should be of length 1');

        expect(actualHost.nodeInterfaces[0].id).toEqual(expectedHostInterface.id,
          'expected host interface id to be: ' + expectedHostInterface.id + ' but it is: ' + actualHost.nodeInterfaces[0].id);
        expect(actualHost.nodeInterfaces[0].address4).toEqual(expectedHostInterface.address4,
          'expected host interface ipv4 address to be: ' + expectedHostInterface.address4 + ' but it is: ' + actualHost.nodeInterfaces[0].address4);
        expect(actualHost.nodeInterfaces[0].address6).toEqual(expectedHostInterface.address6,
          'expected host interface ipv6 address to be: ' + expectedHostInterface.address6 + ' but it is: ' + actualHost.nodeInterfaces[0].address6);
      }
    );
  });

  it('should have loaded links with correct attributes', () => {
    httpClientSpy.get.and.returnValue(asyncData(simpleTopology));

    const expectedRouter = new RouterNode(1, NodePhysicalRoleEnum.Router, 'router');
    const expectedPc = new HostNode(2, NodePhysicalRoleEnum.Desktop, 'pc');
    const expectedRouterInterface = new NodeInterface(3, 1, "150.150.2.2", null);
    const expectedPcInterface = new NodeInterface(4, 2, "150.150.2.1", null);
    const expectedLink1 = new Link(5,
      expectedRouterInterface,
      expectedPcInterface,
      expectedRouter,
      expectedPc,
      LinkTypeEnum.InterfaceOverlay);
    const expectedLink2 = new Link(6,
      expectedPcInterface,
      expectedRouterInterface,
      expectedPc,
      expectedRouter,
      LinkTypeEnum.InterfaceOverlay);

    loaderService.getTopology('test').subscribe(
      topology => {
        expect(topology.links).not.toBeNull('link array should not be null');
        expect(topology.links).not.toBeUndefined('link array should not be undefined');
        expect(topology.links.length).toEqual(2, 'link array should have two elements');

        const actualLink1 = topology.links[0];
        expect(actualLink1).not.toBeNull('link 1 should not be null');
        expect(actualLink1.id).toEqual(expectedLink1.id,
          'expected link id to be: ' + expectedLink1.id + ' but it is: ' + actualLink1.id);
        expect(actualLink1.sourceInterface.id).toEqual(expectedLink1.sourceInterface.id,
          'expected link source interface id to be: ' + expectedLink1.sourceInterface.id + ' but it is: ' + actualLink1.sourceInterface.id);
        expect(actualLink1.targetInterface.id).toEqual(expectedLink1.targetInterface.id,
          'expected link target interface id address to be: ' + expectedLink1.targetInterface.id + ' but it is: ' + actualLink1.targetInterface.id);
        expect(actualLink1.source.id).toEqual(expectedLink1.source.id,
          'expected link source id to be: ' + expectedLink1.source.id + ' but it is: ' + actualLink1.source.id);
        expect(actualLink1.target.id).toEqual(expectedLink1.target.id,
          'expected link target id to be: ' + expectedLink1.target.id + ' but it is: ' + actualLink1.target.id);

        const actualLink2 = topology.links[1];
        expect(actualLink2).not.toBeNull('link 2 should not be null');
        expect(actualLink2.id).toEqual(expectedLink2.id,
          'expected link id to be: ' + expectedLink2.id + ' but it is: ' + actualLink2.id);
        expect(actualLink2.sourceInterface.id).toEqual(expectedLink2.sourceInterface.id,
          'expected link source interface id to be: ' + expectedLink2.sourceInterface.id + ' but it is: ' + actualLink2.sourceInterface.id);
        expect(actualLink2.targetInterface.id).toEqual(expectedLink2.targetInterface.id,
          'expected link target interface id address to be: ' + expectedLink2.targetInterface.id + ' but it is: ' + actualLink2.targetInterface.id);
        expect(actualLink2.source.id).toEqual(expectedLink2.source.id,
          'expected link source id to be: ' + expectedLink2.source.id + ' but it is: ' + actualLink2.source.id);
        expect(actualLink2.target.id).toEqual(expectedLink2.target.id,
          'expected link target id to be: ' + expectedLink2.target.id + ' but it is: ' + actualLink2.target.id);
      }
    );


  });

  it('should have created inner structure', () => {
    httpClientSpy.get.and.returnValue(asyncData(simpleTopology));
    const expectedRouter = new RouterNode(1, NodePhysicalRoleEnum.Router, 'router');
    const expectedHost = new HostNode(2, NodePhysicalRoleEnum.Desktop, 'pc');

    loaderService.getTopology('test').subscribe(
      topology => {
        const actualRouter = topology.nodes[0] as RouterNode;
        expect(actualRouter.children.length).toEqual(1, 'expected router node to have 1 child');
        expect(actualRouter.children[0].id).toEqual(expectedHost.id,
          'expected router child to have id: ' + expectedRouter.id + ' but it is: ' + actualRouter.children[0].id);
      });
  });

  it('should have loaded nothing', () => {
    httpClientSpy.get.and.returnValue(asyncData(emptyTopology));
    loaderService.getTopology('test').subscribe(
      topology => {
        expect(topology.nodes.length).toEqual(0, 'nodes array should be empty');
        expect(topology.links.length).toEqual(0, 'links array should be empty');
      });
  });

  it('should have loaded multiple interfaces for one node', () => {
    httpClientSpy.get.and.returnValue(asyncData(emptyTopology));
    loaderService.getTopology('test').subscribe(
      topology => {
        expect(topology.nodes.length).toEqual(0, 'nodes array should be empty');
        expect(topology.links.length).toEqual(0, 'links array should be empty');
      });
  });


  it('should have loaded multiple interfaces for one node with correct attributes', () => {
    httpClientSpy.get.and.returnValue(asyncData(multipleInterfaces));
    const expectedRouterInterface1 = new NodeInterface(3, 1, '150.150.2.2', 'e80::1ff:fe23:4567:890b');
    const expectedRouterInterface2 = new NodeInterface(33, 1, '150.150.2.22', 'e80::1ff:fe23:4567:891b');

    const expectedHostInterface1 = new NodeInterface(4, 2, '150.150.2.1', 'e80::1ff:fe23:4567:890a');
    const expectedHostInterface2 = new NodeInterface(44, 2, '150.150.2.11', 'e80::1ff:fe23:4567:891a');


    loaderService.getTopology('test').subscribe(
      topology => {
        const actualRouter = topology.nodes[0];
        expect(actualRouter.nodeInterfaces).not.toBeNull('router interfaces should not be null');
        expect(actualRouter.nodeInterfaces).not.toBeUndefined('router interfaces should not be undefined');
        expect(actualRouter.nodeInterfaces.length).toEqual(2, 'router interfaces should be of length 2');

        expect(actualRouter.nodeInterfaces[0].id).toEqual(expectedRouterInterface1.id,
          'expected routers first interface id to be: ' + expectedRouterInterface1.id + ' but it is: ' + actualRouter.nodeInterfaces[0].id);
        expect(actualRouter.nodeInterfaces[0].address4).toEqual(expectedRouterInterface1.address4,
          'expected routers first interface ipv4 address to be: ' + expectedRouterInterface1.address4 + ' but it is: ' + actualRouter.nodeInterfaces[0].address4);
        expect(actualRouter.nodeInterfaces[0].address6).toEqual(expectedRouterInterface1.address6,
          'expected routers first interface ipv6 address to be: ' + expectedRouterInterface1.address6 + ' but it is: ' + actualRouter.nodeInterfaces[0].address6);

        expect(actualRouter.nodeInterfaces[1].id).toEqual(expectedRouterInterface2.id,
          'expected routers second interface id to be: ' + expectedRouterInterface2.id + ' but it is: ' + actualRouter.nodeInterfaces[1].id);
        expect(actualRouter.nodeInterfaces[1].address4).toEqual(expectedRouterInterface2.address4,
          'expected routers second interface ipv4 address to be: ' + expectedRouterInterface2.address4 + ' but it is: ' + actualRouter.nodeInterfaces[1].address4);
        expect(actualRouter.nodeInterfaces[1].address6).toEqual(expectedRouterInterface2.address6,
          'expected routers second interface ipv6 address to be: ' + expectedRouterInterface2.address6 + ' but it is: ' + actualRouter.nodeInterfaces[1].address6);

        const actualHost = topology.nodes[1];
        expect(actualHost.nodeInterfaces).not.toBeNull('host interfaces should not be null');
        expect(actualHost.nodeInterfaces).not.toBeUndefined('host interfaces should not be undefined');
        expect(actualHost.nodeInterfaces.length).toEqual(2, 'host interfaces should be of length 2');

        expect(actualHost.nodeInterfaces[0].id).toEqual(expectedHostInterface1.id,
          'expected hosts first interface id to be: ' + expectedHostInterface1.id + ' but it is: ' + actualHost.nodeInterfaces[0].id);
        expect(actualHost.nodeInterfaces[0].address4).toEqual(expectedHostInterface1.address4,
          'expected hosts first interface ipv4 address to be: ' + expectedHostInterface1.address4 + ' but it is: ' + actualHost.nodeInterfaces[0].address4);
        expect(actualHost.nodeInterfaces[0].address6).toEqual(expectedHostInterface1.address6,
          'expected hosts first interface ipv6 address to be: ' + expectedHostInterface1.address6 + ' but it is: ' + actualHost.nodeInterfaces[0].address6);

        expect(actualHost.nodeInterfaces[1].id).toEqual(expectedHostInterface2.id,
          'expected hosts second interface id to be: ' + expectedHostInterface2.id + ' but it is: ' + actualHost.nodeInterfaces[1].id);
        expect(actualHost.nodeInterfaces[1].address4).toEqual(expectedHostInterface2.address4,
          'expected hosts second interface ipv4 address to be: ' + expectedHostInterface2.address4 + ' but it is: ' + actualHost.nodeInterfaces[1].address4);
        expect(actualHost.nodeInterfaces[1].address6).toEqual(expectedHostInterface2.address6,
          'expected hosts second interface ipv6 address to be: ' + expectedHostInterface2.address6 + ' but it is: ' + actualHost.nodeInterfaces[1].address6);
      }
    );
  });
});

