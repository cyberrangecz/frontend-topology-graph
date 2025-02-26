# Topology Graph Component

Topology Graph Component is an Angular library using D3.js to visualize network graph topology.

## Usage

To use the topology component in your Angular application follow these steps:

1. Run `npm install @crczp/topology-graph`
2. Create topology config of type `TopologyGraphConfig` with the following properties:
   + topologyRestUrl - should point to [Sandbox service](https://github.com/cyberrangecz/backend-sandbox-service)
   + pollingPeriod   - how often to update endpoints
   + retryAttempts   - how many times try to update
   + guacamoleConfig - configuration for guacamole:
     + url - url of guacamole service
     + username - username for guacamole service
     + password - password for guacamole service

3. Import necessary icons in your `angular.json` file:
   ```json
   "assets": [
       {
           "glob": "**/*",
           "input": "node_modules/@crczp/topology-graph/assets",
           "output": "assets/topology-graph"
       }
   ]
   ```
   Or provide your own icons at the same path, with the same names.

4. Import **topologyGraphModule** from **topology-graph** and add it to imports in your module with `topologyGraphModule.forRoot(your-config-here)`.
5. Use `<crczp-topology-graph>` directive in your code and pass sandbox id using `[sandboxUuid]` attribute. If you wish to be notified when data of topology is loaded for the first time you can bind to `(onTopologyLoaded)` event.
6. Manually copy folders decorators and icons into your assets/images (script or better way to include assets TBD)
7. Subscribe to observables of `topologyLoadingService` and `topologyErrorService` to display loading and error messages emitted from the component in a standard way of your app
