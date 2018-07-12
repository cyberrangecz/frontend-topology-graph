import {Link} from '../link/link';
import {GeoNode} from '../node/geo-node';
import {Geo} from '../others/geo';

/**
 * Google map model
 */

export class GoogleMap {
  nodes: GeoNode[];
  links: Link[];

  constructor(nodes: GeoNode[], link: Link[]) {
    this.nodes = nodes;
    this.links = link;
  }

  /**
   * Algorithm to calculate midpoint between all nodes
   * see: http://www.geomidpoint.com/calculation.html
   * @returns {Geo} geographical coordinates of calculated midpoint
   */
   findMidpoint(): Geo {
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (const node of this.nodes) {
      const lat = this.degrToRad(node.geo.latitude);
      const lng = this.degrToRad(node.geo.longitude);

      sumX += Math.cos(lat) * Math.cos(lng);
      sumY += Math.cos(lat) * Math.sin(lng);
      sumZ += Math.sin(lat);
    }

    const avgX = sumX / this.nodes.length;
    const avgY = sumY / this.nodes.length;
    const avgZ = sumZ / this.nodes.length;

    const lng = Math.atan2(avgY, avgX);
    const hyp = Math.sqrt((avgX * avgX) + (avgY * avgY));
    const lat = Math.atan2(avgZ, hyp);

    return new Geo(
      this.radToDegr(lat),
      this.radToDegr(lng));
  }

  /**
   * Converts radians to degrees
   * @param {number} rad number in radians
   * @returns {number} number converted to degrees
   */
   radToDegr(rad: number): number {
    return (rad * 180) / Math.PI;
  }

  /**
   * Converts degrees to radians
   * @param {number} degr number in degrees
   * @returns {number} number converted to radians
   */
   degrToRad(degr: number): number {
    return (degr * Math.PI) / 180;
  }
}
