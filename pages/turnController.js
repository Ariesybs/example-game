import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class TurnController extends OrbitControls {
  constructor(camera, domElement) {
    super(camera, domElement);
    this.minPolarAngle = Math.PI / 4; // 最小极角
    this.maxPolarAngle = Math.PI / 2; // 最大极角
    this.minAzimuthAngle = -Infinity; // 最小方位角
    this.maxAzimuthAngle = Infinity; // 最大方位角
    
  }

  
}
