import { HemisphereLight, DirectionalLight } from "three";

export class HemiLight extends HemisphereLight {
  constructor() {
    super(0xffffff, 0xffffff, 2);
    this.color.setHSL(0.6, 1, 0.6);
    this.groundColor.setHSL(0.095, 1, 0.75);
    this.position.set(0, 500, 0);
  }
}

export class DirLight extends DirectionalLight {
  constructor() {
    super(0xffffff, 3);
    this.color.setHSL(0.1, 1, 0.95);
    this.position.set(-1, 10, 1);
    this.position.multiplyScalar(30);
    this.castShadow = true;
    this.shadow.mapSize.width = 2048;
    this.shadow.mapSize.height = 2048;

    const d = 300;

    this.shadow.camera.left = -d;
    this.shadow.camera.right = d;
    this.shadow.camera.top = d;
    this.shadow.camera.bottom = -d;
    
    this.shadow.camera.far = 1000;
    this.shadow.bias = -0.003;
  }
}
