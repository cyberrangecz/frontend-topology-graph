# Topology Graph Component

Topology Graph Component is an Angular library using D3.js to visualize network graph topology.

## Usage

To use the topology component in your Angular application follow these steps:

1. Run `npm install @cyberrangecz-platform/topology-graph`
2. Create topology config class extending **topologyGraphConfig** from the library. Config contains following options:
    + topologyRestUrl (url where Sandbox microservice is running)
    + decoratorsRestUrl (currently not supported by backend, leave as empty string)
    + defaultDecoratorRefreshPeriodInSeconds (currently not supported by backend)
    + useRealTime (currently not supported by backend, always set to false)
    + useDecorators (currently not supported by backend, always set to false)
3. Import **topologyGraphModule** from **topology-graph** and add it to imports in your module with `topologyGraphModule.forRoot(new CustomTopologyConfig())`.
4. Use `<crczp-topology-graph>` directive in your code and set its size by binding to `[width]` and `[height]` attributes. Pass sandbox id to component by binding to `[sandboxUuid]` attribute. If you wish to be notified when data of tology is loaded for the first time you can bind to `(onTopologyLoaded)` event.
5. Manually copy folders decorators and icons into your assets/images (script or better way to include assets TBD)
6. Subscribe to observables of `topologyLoadingService` and `topologyErrorService` to display loading and error messages emitted from the component in a standard way of your app

You will need to provide data for the components. This can be done in two ways

* Use mocked data with [JSON server](https://github.com/typicode/json-server). After installing json-server run `npm run api`.
* Run the app in local environment and ssl `ng serve --ssl`
