import {Route, Routes} from '@angular/router';
import {RouterNavLink} from './router-nav-link';

export class RouterNavLinks {

  links: RouterNavLink[] = [];

  constructor(routes: Routes) {
    routes.forEach((route) => this.parseRoute(route));
  }

  private parseRoute(route: Route) {
    switch (route.path.toLowerCase()) {
      case 'map': {
        this.links.push(new RouterNavLink(route.path, 'Map'));
        break;
      }
      case 'graph': {
        this.links.push(new RouterNavLink(route.path, 'Graph'));
        break;
      }
      default:
        break;
    }
  }
}
