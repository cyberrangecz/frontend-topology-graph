# Topology Graph Component

Topology Graph Component is an Angular library using D3.js to visualize network graph topology.
It is designed to communicate with REST API of [Sandbox microservice](https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-django-openstack)

## Prerequisites

To use the library you need to have installed:

* NPM with private [KYPO Nexus repository](https://projects.ics.muni.cz/projects/kbase/knowledgebase/articles/153)
* Angular Material v8 or higher
* [D3.js v5](https://www.npmjs.com/package/d3) and [D3 types](https://www.npmjs.com/package/@types/d3)
* [kypo2-topology-graph-model](https://gitlab.ics.muni.cz/kypo2/frontend-new/kypo2-angular-topology-model)
* kypo2-topology-collision-avoidance v 1.0.0 (available in nexus repository)
* [angular-ts-math](https://www.npmjs.com/package/angular-ts-math)
* [moment](https://www.npmjs.com/package/moment)
 
## Usage

To use the topology component in your Angular application follow these steps:

1. Run `npm install kypo2-topology-graph`
2. Create topology config class extending **Kypo2TopologyGraphConfig** from the library. Config contains following options:
    + topologyRestUrl (url where Sandbox microservice is running)
    + decoratorsRestUrl (currently not supported by backend, leave as empty string)
    + defaultDecoratorRefreshPeriodInSeconds (currently not supported by backend)
    + useRealTime (currently not supported by backend, always set to false)
    + useDecorators (currently not supported by backend, always set to false)
3. Import **Kypo2TopologyGraphModule** from **kypo2-topology-graph** and add it to imports in your module with `Kypo2TopologyGraphModule.forRoot(new CustomTopologyConfig())`.
4. Use `<kypo2-topology-graph>` directive in your code and set its size by binding to `[width]` and `[height]` attributes. Pass sandbox id to component by binding to `[sandboxId]` attribute. If you wish to be notified when data of tology is loaded for the first time you can bind to `(onTopologyLoaded)` event.
5. Manually copy folders decorators and icons into your assets/images (script or better way to include assets TBD)
6. Subsribe to observables of `Kypo2TopologyLoadingService` and `Kypo2TopologyErrorService` to display loading and error messages emitted from the component in a standard way of your app

You will need to provide data for the components. This can be done in two ways
* Set up backend service locally. [Guide here](https://gitlab.ics.muni.cz/kypo2/services-and-portlets/kypo2-topology).
* Use mocked data with [JSON server](https://github.com/typicode/json-server). After installing json-server run `json-server -w db.json -r routes.json` in project dir.
