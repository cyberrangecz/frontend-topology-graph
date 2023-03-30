# Topology Graph Component

Topology Graph Component is an Angular library using D3.js to visualize network graph topology.
It is designed to communicate with REST API of [Sandbox microservice](https://gitlab.ics.muni.cz/kypo-crp/backend-python/kypo-django-openstack)

## Prerequisites

To use the library you need to have installed:

* NPM with access to [KYPO registry](https://projects.ics.muni.cz/projects/kbase/knowledgebase/articles/153)
 
## Usage

To use the topology component in your Angular application follow these steps:

1. Run `npm install @muni-kypo-crp/topology-graph`
2. Create topology config class extending **kypoTopologyGraphConfig** from the library. Config contains following options:
    + topologyRestUrl (url where Sandbox microservice is running)
    + decoratorsRestUrl (currently not supported by backend, leave as empty string)
    + defaultDecoratorRefreshPeriodInSeconds (currently not supported by backend)
    + useRealTime (currently not supported by backend, always set to false)
    + useDecorators (currently not supported by backend, always set to false)
3. Import **kypoTopologyGraphModule** from **kypo-topology-graph** and add it to imports in your module with `kypoTopologyGraphModule.forRoot(new CustomTopologyConfig())`.
4. Use `<kypo-topology-graph>` directive in your code and set its size by binding to `[width]` and `[height]` attributes. Pass sandbox id to component by binding to `[sandboxUuid]` attribute. If you wish to be notified when data of tology is loaded for the first time you can bind to `(onTopologyLoaded)` event.
5. Manually copy folders decorators and icons into your assets/images (script or better way to include assets TBD)
6. Subscribe to observables of `kypoTopologyLoadingService` and `kypoTopologyErrorService` to display loading and error messages emitted from the component in a standard way of your app

You will need to provide data for the components. This can be done in two ways
* Use mocked data with [JSON server](https://github.com/typicode/json-server). After installing json-server run `json-server -w utils/json-server/db.json -r utils/json-server/routes.json`.
* Run the app in local environment and ssl `ng serve --ssl`
