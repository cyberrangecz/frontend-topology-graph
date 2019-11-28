# topology-collision-avoidance

Angular-based re-implementation of the collision avoidance algorithm and visualization. Implemented as bachelor thesis by Roman Felinger <445559@mail.muni.cz> since 09/2018. Expected finish 06/2019.

# To run

1. Clone angular topology application `git clone git@gitlab.ics.muni.cz:445559/kypo2-angular-topology.git`
2. Navigate into projects folder inside cloned application `cd kypo2-angular-topology/projects/`
3. Clone collision avoidance library `git clone git@gitlab.ics.muni.cz:445559/topology-collision-avoidance.git`
2. Navigate into repository `cd topology-collision-avoidance/` and run `npm install`
4. Return to app folder `cd ../..` and run `npm install`
5. Install topology model `npm install git+ssh://git@gitlab.ics.muni.cz:kypo2/frontend-new/kypo2-angular-topology-model.git#package`
6. Install spice client `npm install git+ssh://git@gitlab.ics.muni.cz:kypo2/frontend-new/kypo2-spice-client.git#package`
6. Build library `ng build --project topology-collision-avoidance`
7. Install json dummy server `npm i json-server` and start it `json-server -w db.json -r routes.json`
8. Deploy application using localhost `ng serve`
9. Application runs on `http://localhost:4200/`