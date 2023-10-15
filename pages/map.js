import { Mesh, PlaneGeometry, MeshLambertMaterial } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
export class Map extends Mesh {
  constructor(scene) {
    super();
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.treeList = [];
    const groundGeo = new PlaneGeometry(10000, 10000);
    const groundMat = new MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL(0.095, 1, 0.75);

    this.geometry = groundGeo;
    this.material = groundMat;

    this.position.y = -30;
    this.rotation.x = -Math.PI / 2;
    this.receiveShadow = true;
    this.loadTrees(10);
    this.loadBushs(10);
    this.loadFlowers(10);
  }
  loadTrees(count) {
    this.loadMesh("Tree_1", count, 15);
    this.loadMesh("Tree_2", count, 15);
    this.loadMesh("Tree_3", count, 15);
  }

  loadBushs(count) {
    this.loadMesh("Bush", count, 10);
  }

  loadFlowers(count) {
    this.loadMesh("Flowers_1", count, 10);
    this.loadMesh("Flowers_2", count, 10);
  }

  loadMesh(name, count, scale) {
    for (let i = 0; i < count; i++) {
      const min = -1000;
      const max = 1000;
      const randomX = Math.random() * (max - min) + min;
      const randomZ = Math.random() * (max - min) + min;
      const randomRotationY = Math.random() * Math.PI * 2; // 随机Y轴旋转角度
      this.loader.load(`/models/environment/${name}.gltf`, (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true; // 启用投射阴影
            child.receiveShadow = true; // 启用接收阴影
          }
        });
        const mesh = model.children[0];
        if (mesh) {
          mesh.scale.set(scale, scale, scale);
          mesh.position.set(randomX, -30, randomZ);
          mesh.rotationY = randomRotationY;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.scene.add(mesh);
        }
      });
    }
  }
}
