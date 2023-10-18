/**
 * 鼠标控制器
 */
import * as THREE from "three";

export class TurnController {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;
    this.sensitivity = 0.001
    this.isMouseLocked = false;
    this.control = {
      spherical: new THREE.Spherical(1, Math.PI / 4, Math.PI / 4),
      distance: 150,
      pan: new THREE.Vector2(),
      dampingFactor: 0.05,
      enableDamping: true,
      maxDistance: 250,
      minDistance: 100,
    };


    this.init();
    this.initListeners();
  }
  
  init() {
    this.control.spherical.radius = this.control.distance
    this.domElement = document.body;
    //this.domElement.style.cursor = 'none';
    this.domElement.addEventListener('click', this.onMouseClick.bind(this));
  }

  initListeners() {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('wheel', this.onMouseWheel.bind(this));
    document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this));
    document.addEventListener('mozpointerlockchange', this.onPointerLockChange.bind(this));

    
  }
  onMouseClick(event) {
    if (!this.isMouseLocked) {
      this.domElement.requestPointerLock();
    }
  }
  onPointerLockChange() {
    if (document.pointerLockElement === this.domElement || document.mozPointerLockElement === this.domElement) {
      // 鼠标已被锁定
      this.isMouseLocked = true;
    } else {
      // 鼠标未被锁定
      this.isMouseLocked = false;
    }
  }
  

  onMouseWheel(event) {
    if(this.isMouseLocked){
      event.preventDefault();
      const delta = event.deltaY;
      this.control.spherical.radius += delta * 0.1;
      this.control.spherical.radius = Math.max(this.control.minDistance, Math.min(this.control.maxDistance, this.control.spherical.radius));
      this.updateCameraPosition();
    }
  }

  onMouseMove(event) {
    if(this.isMouseLocked){
      // 获取鼠标的相对位移
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      // 根据鼠标移动调整相机的角度
      this.control.spherical.theta -= movementX * this.sensitivity;
      this.control.spherical.phi -= movementY * this.sensitivity;

      // 限制垂直旋转角度的范围
      this.control.spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, this.control.spherical.phi));

      // 更新相机的位置
      this.updateCameraPosition();
    }
  }

  updateCameraPosition() {
    const spherical = this.control.spherical;
    const target = this.target;
    const position = new THREE.Vector3().setFromSpherical(spherical);
    position.add(target);

    this.camera.position.copy(position);
    this.camera.lookAt(this.target.clone().add(new THREE.Vector3(0, 30, 0)));
  }

  update() {
    if (this.control.enableDamping) {
      this.control.spherical.theta += this.control.pan.x * this.control.dampingFactor;
      this.control.spherical.phi += this.control.pan.y * this.control.dampingFactor;
    }

    this.updateCameraPosition();
  }
}
