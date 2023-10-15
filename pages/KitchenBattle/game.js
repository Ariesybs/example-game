import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
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
    //高亮后处理
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    this.composer.addPass(this.outlinePass);
    /**参数调节 */
    this.outlinePass.renderToScreen = true;
    this.outlinePass.edgeStrength = 5; // 粗
    //this.outlinePass.visibleEdgeColor.set("green"); // 设置显示的颜色
    this.outlinePass.selectedObjects = [];
    /**抗锯齿处理 */
    this.fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms["resolution"].value.x =
      1 / (window.innerWidth * pixelRatio);
    this.fxaaPass.material.uniforms["resolution"].value.y =
      1 / (window.innerHeight * pixelRatio);
    this.composer.addPass(this.fxaaPass);

    //材质通道处理
    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);

    // 创建 OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // 启用阻尼效果，使摄像机平滑移动
    this.controls.dampingFactor = 0.05; // 调整阻尼因子

    // 添加环境光
    this.ambientLight = new THREE.AmbientLight(0x404040); // 设置环境光颜色
    this.scene.add(this.ambientLight);

    // 添加直射光
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3); // 设置直射光颜色和强度
    this.directionalLight.position.set(10, 10, 10); // 设置光源位置
    this.scene.add(this.directionalLight);

    // 创建地板
    // this.floorGeometry = new THREE.BoxGeometry(10, 10, 10); // 地板的大小
    // this.floorMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x808080,
    //   side: THREE.DoubleSide,
    // }); // 地板的材质
    // this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    // this.floor.position.set(0, 0, 0);
    // this.floor.name = "cube";
    // this.floor.rotation.x = Math.PI / 2; // 使地板水平
    // this.scene.add(this.floor);
    this.loadModelsName().then(() => {
      this.index = 0;
      this.loadModel(this.index);
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
      food.scale.set(s, s, s);
      this.scene.add(food);
    });
  };

  handleMouseDown = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.food);
    if (intersects.length > 0) {
      this.outlinePass.selectedObjects = [intersects[0].object];
    } else {
      this.outlinePass.selectedObjects = [];
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
      console.log(this.modelsName);
      // 在这里处理 API 返回的数据
    } catch (error) {
      console.error("发生错误：", error);
    }
  };

  animate() {
    this.controls.update();

    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}
