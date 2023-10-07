import {
  Scene,
  Color,
  Fog,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  Vector3
} from "three";
import { HemiLight, DirLight } from "./light";
import { Map } from "./map";
import { Sky } from "./sky";
import { Character } from "./character";
import { PlayerController } from "./playerController";
import { GamepadManager } from "./gamepadManager";
import { UI } from "./ui";
export class Game {
  constructor() {
    this.init();
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize);
    document.getElementById("container").appendChild(this.renderer.domElement);
    //隐藏滚动条
    this.style = document.createElement("style");
    this.style.innerHTML = `
      body {
        overflow: hidden;
      }
    `;
    document.head.appendChild(this.style);
  }

  init() {
    this.scene = new Scene();
    this.scene.background = new Color().setHSL(0.6, 0, 1);
    this.scene.fog = new Fog(this.scene.background, 1, 5000);

    this.camera = new PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    this.camera.position.set(0, -10, 250);

    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.mixer = new AnimationMixer();
    this.map = new Map();
    this.hemiLight = new HemiLight();
    this.dirLight = new DirLight();
    this.sky = new Sky(this.hemiLight, this.scene);
    this.ui = new UI("container")
    this.v = 0
    this.loadCharacter("Cow");
  }
  async loadCharacter(characterName) {
    this.character = new Character(this.mixer);
    await this.character.loadCharacter(characterName);
    this.characterMesh = this.character.mesh;
    this.gamepadManager = new GamepadManager(this.character,this.mixer)
    this.playerController = new PlayerController(
      this.camera,
      this.renderer.domElement,
      this.character,
      this.mixer
    );
    this.load();
    this.render();
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  load() {
    this.scene.add(this.hemiLight);
    this.scene.add(this.dirLight);
    this.scene.add(this.map);
    this.scene.add(this.sky);
    this.scene.add(this.characterMesh);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // 渲染逻辑
    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }
    if(this.character.isRun){
      if(this.v < 0.7){
        this.v += 0.05
    }
    }else{
      if(this.v >0)this.v -= 0.05
      else this.v = 0
    }

  // 获取模型的本地Z轴
  var localZ = new Vector3(0, 0, 1);

  // 将本地Z轴转换为模型的世界坐标系
  localZ.applyQuaternion(this.character.mesh.quaternion);

  // 计算移动向量
  var moveDirection = localZ.clone().multiplyScalar(this.v);

  // 更新模型的位置
  this.character.mesh.position.add(moveDirection);
    // 继续下一帧
    requestAnimationFrame(this.render.bind(this));
  }
}
