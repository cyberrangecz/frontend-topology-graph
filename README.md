# Graph Topology Component

Graph Topology Component is an Angular library using D3.js visualizing network graph topology.

## Prerequisites

To use the library you need to have installed:

* npm
* Angular Material v6 or higher
* D3.js v5 or higher

## Usage

To use the topology component in your Angular application follow these steps:

1. Run `npm install git+ssh://git@gitlab.ics.muni.cz:kypo2/frontend-new/kypo2-angular-topology.git#package`
2. Create topology config class extending **TopologyConfig** from the library. Config contains following options:
+  decoratorsRestUrl
+ defaultDecoratorRefreshPeriodInSeconds
+ topologyRestUrl
+ useRealTime
2. Import **GraphModule** from **graph-topology** and add it to imports in your module with `GraphModule.forRoot(new CustomTopologyConfig())`.
3. Use `<lib-force-graph>` directive in your code and set its size by binding to [width] and [height] attributes.
4. Manually copy folders decorators and icons into your assets/images (script or better way to include assets TBD)

## Developers

* Martin Hamernik (445720@mail.muni.cz)
