import {
  Scene,
  Color,
  Fog,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  Vector3,
  MathUtils,
  LoadingManager
} from "three";
import { HemiLight, DirLight } from "./light";
import { Map } from "./map";
import { Sky } from "./sky";
import { Character } from "./character";
import { PlayerController } from "./playerController";
import { GamepadManager } from "./gamepadManager";
import { UI } from "./ui";
import { ChooseBox } from "./chooseBox";
import { Loading } from "./loading";
export class Game {
  constructor() {
    this.init();

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize);
    document.getElementById("container").appendChild(this.renderer.domElement);
    //隐藏滚动条并更改鼠标样式
    this.style = document.createElement("style");
    this.style.innerHTML = `
      body {
        overflow: hidden;
        cursor: url('/cursor.ico'), auto;
      }
    `;
    document.head.appendChild(this.style);
  }

  init() {
    this.loadFinished = false;
    this.scene = new Scene();
    this.scene.background = new Color().setHSL(0.6, 0, 1);
    this.scene.fog = new Fog(this.scene.background, 1, 5000);
    this.mountedFunction = null; // 初始挂载函数为 null
    this.camera = new PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    this.camera.position.set(0, 0, 250);
    this.loadingManager = new LoadingManager()
    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.mixer = new AnimationMixer();
    this.chooseBox = new ChooseBox(
      this.scene,
      this.camera,
      this.renderer,
      this.mixer,
      this.mountedFunction
    );
    this.start = false;
    this.clock = new Clock();
    this.hemiLight = new HemiLight();
    this.dirLight = new DirLight();
    this.sky = new Sky(this.hemiLight, this.scene);
    this.scene.add(this.hemiLight);
    this.scene.add(this.dirLight);
    this.scene.add(this.sky);
    this.scene.add(this.chooseBox);
    this.render();
    //玩家选择完角色后再加载地图
    this.chooseBox.setCallBack((name) => {
      //加载页面
      //const loading = new Loading()
      this.chooseBox.components.forEach((component) => {
        this.scene.remove(component);
      });
      this.scene.remove(this.chooseBox);
      this.chooseBox = null;
      // this.loadingManager.onProgress = (item,loaded,total)=>{
      //   const progress = Math.floor(loaded / total * 100);
      //   console.log(progress)
      //   loading.setProgress(progress);
      // }
      this.load(name)//.then(loading.complete())
    
    });
  }

  async load(name) {
    this.map = new Map(this.scene);
    this.ui = new UI("container");
    await this.loadCharacter(name);
    this.scene.add(this.map);
  }

  async loadCharacter(characterName) {
    this.character = new Character(this.mixer,this.camera);
    await this.character.loadCharacter(characterName);
    this.characterMesh = this.character.mesh;
    this.dirLight.target = this.characterMesh;
    
    this.scene.add(this.characterMesh);
    //键鼠控制器
    this.playerController = new PlayerController(
      this.camera,
      this.characterMesh.position,
      this.character,
      this.mixer
    );
    //手柄控制器
    this.gamepadManager = new GamepadManager(
      this.character,
      this.camera,
      this.mixer
    );
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  



  render() {
    this.renderer.render(this.scene, this.camera);
    const deltaTime = this.clock.getDelta();
    // 渲染逻辑
    // if (this.mixer) {
    //   const delta = this.clock.getDelta();
    //   this.mixer.update(delta);
    // }
    if(this.chooseBox){
      this.chooseBox.update(deltaTime)
    }
    if (this.character) {
      this.character.update(deltaTime);
    }
    if(this.playerController){
      this.playerController.update()
    }


    // 继续下一帧
    requestAnimationFrame(this.render.bind(this));
  }
}
