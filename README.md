# Topology Graph Component

**Current version: 1.0.0**

Topology Graph Component is an Angular library using D3.js to visualize network graph topology.
It can be imported as an independent component into your project.

## Prerequisites

To use the library you need to have installed:

* NPM with private [KYPO Nexus repository](https://projects.ics.muni.cz/projects/kbase/knowledgebase/articles/153)
* Angular Material v8 or higher
* D3.js v5 or higher
* [Topology Graph Model library](https://gitlab.ics.muni.cz/kypo2/frontend-new/kypo2-angular-topology-model)

 
## Usage

To use the topology component in your Angular application follow these steps:


1. Run `npm install kypo2-topology-graph-model` and `npm install kypo2-topology-graph`
2. Create topology config class extending **Kypo2TopologyGraphConfig** from the library. Config contains following options:
    + topologyRestUrl
    + decoratorsRestUrl (currently not supported by backend, leave as empty string)
    + defaultDecoratorRefreshPeriodInSeconds (currently not supported by backend)
    + useRealTime (currently not supported by backend, always set to false)
    + useDecorators (currently not supported by backend, always set to false)
3. Import **Kypo2TopologyGraphModule** from **kypo2-topology-graph** and add it to imports in your module with `Kypo2TopologyGraphModule.forRoot(new CustomTopologyConfig())`.
4. Use `<kypo2-topology-graph>` directive in your code and set its size by binding to `[width]` and `[height]` attributes. Pass sandbox id to component by binding to `[sandboxId]` attribute. If you wish to be notified when data of tology is loaded you can bind to `(onTopologyLoaded)` event.
5. Manually copy folders decorators and icons into your assets/images (script or better way to include assets TBD)

## Developers

* Martin Hamernik (445720@mail.muni.cz)
