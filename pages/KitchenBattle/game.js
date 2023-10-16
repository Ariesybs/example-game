import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { PostProcessing } from "./postprocessing";
import { Light } from "./light";
import { Control } from "./control";
import { Map } from "./map";
import { Physics } from "./physics";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, -10);
    this.renderer = new THREE.WebGLRenderer();
    this.light = new Light(this.scene)
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setPath("/KitchenBattle/models/foods/");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(this.renderer.domElement);
    document.title = "Kitchen Battle";
    document.body.style.overflow = "hidden";
    
    // this.controls = new FirstPersonControls(
    //   this.camera,
    //   this.renderer.domElement
    // );
    // this.controls.movementSpeed = 1;
    // this.controls.lookSpeed = 0.1;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.postProcessing = new PostProcessing(this.renderer,this.scene,this.camera)

    // 创建 OrbitControls
    this.control = new Control(this.camera,this.renderer)
    //创建cannon物理引擎
    this.physics = new Physics(this.scene)

    // 创建地板
    this.floor = new Map(this.scene)
    this.floorPhysicalBody = this.physics.addPhysics(this.floor,0)
    this.scene.add(this.floor)
    this.loadModelsName().then(() => {
      this.index = 0;
      this.loadModel(this.index)
      
    });



    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("resize", this.handleWinResize);
    window.addEventListener("keydown", this.handleKeyDown);

    this.animate();
  }


  loadModel = async (index) => {
    this.gltfLoader.load(this.modelsName[index], (gltf) => {
      const food = gltf.scene;
      
      if (this.food) this.scene.remove(this.food);
      this.food = food;
      const s = 10;
      food.position.set(0,10,0)
      food.scale.set(s, s, s);
      this.foodPhysicalBody = this.physics.addPhysics(this.food,1000)
      this.scene.add(food);
    });
  };

  handleMouseDown = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.food);
    if (intersects.length > 0) {
      this.postProcessing.setOutLine([intersects[0].object])
    } else {
      this.postProcessing.setOutLine([]);
    }
  };

  handleWinResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (this.index > 0) {
        this.index -= 1;
        this.loadModel(this.index);
      }

      // 在这里执行你的逻辑
    } else if (event.key === "ArrowRight") {
      if (this.index < this.modelsName.length) {
        this.index += 1;
        this.loadModel(this.index);
      }
    }
  };

  loadModelsName = async () => {
    try {
      const response = await fetch("../api/loadModelsName");
      if (!response.ok) {
        throw new Error("API 请求失败");
      }

      const data = await response.json();
      this.modelsName = data.files;
      // 在这里处理 API 返回的数据
    } catch (error) {
      console.error("发生错误：", error);
    }
  };

  animate() {
    this.control.orbitControls.update();

    if (this.postProcessing) {
      this.postProcessing.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    if(this.foodPhysicalBody){
      this.food.position.copy(this.foodPhysicalBody.position)
      this.food.quaternion.copy(this.foodPhysicalBody.quaternion)
    }
    this.physics.update()

    requestAnimationFrame(this.animate.bind(this));
  }
}
