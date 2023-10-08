import { Mesh, PlaneGeometry, MeshLambertMaterial } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
export class Map extends Mesh {
  constructor(scene) {
    super();
    this.scene = scene
    this.loader = new GLTFLoader()
    this.treeList = []
    const groundGeo = new PlaneGeometry(10000, 10000);
    const groundMat = new MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL(0.095, 1, 0.75);

    this.geometry = groundGeo;
    this.material = groundMat;

    this.position.y = -30;
    this.rotation.x = -Math.PI / 2;
    this.receiveShadow = true;
    this.loadTrees()
  }
  async loadTrees() {
    for (let i = 0; i < 50; i++) {
      // 生成一个1到3之间的随机整数
      const tree_id =  Math.floor(Math.random() * 3) + 1;
      const min = -1000;
      const max = 1000; 
      const randomX = Math.random() * (max - min) + min;
      const randomZ = Math.random() * (max - min) + min;
      const randomRotationX = Math.random() * Math.PI * 2; // 随机X轴旋转角度
      const randomRotationY = Math.random() * Math.PI * 2; // 随机Y轴旋转角度
      const randomRotationZ = Math.random() * Math.PI * 2; // 随机Z轴旋转角度
      
      
      this.loader.load(`/models/Tree/Tree_${tree_id}.gltf`,(gltf)=>{
        const tree = gltf.scene
        const mesh = tree.children[0]
        if(mesh){
          const s = 15
          mesh.scale.set(s,s,s)
          mesh.position.set(randomX,-30,randomZ)
          mesh.rotationY = randomRotationY
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.scene.add(mesh)
        }
      })
      
    }
    
  }

}
