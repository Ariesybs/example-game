import { Mesh, PlaneGeometry, MeshLambertMaterial } from "three";
export class Map extends Mesh {
  constructor() {
    super();

    const groundGeo = new PlaneGeometry(10000, 10000);
    const groundMat = new MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL(0.095, 1, 0.75);

    this.geometry = groundGeo;
    this.material = groundMat;

    this.position.y = -30;
    this.rotation.x = -Math.PI / 2;
    this.receiveShadow = true;
  }
}
