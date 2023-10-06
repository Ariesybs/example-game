import {
  Scene,
  Color,
  Fog,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AnimationMixer,
} from "three";
import { HemiLight, DirLight } from "./light";
import { Map } from "./map";
import { Sky } from "./sky";
import { Character } from "./character";
import { PlayerController } from "./playerController";
export class Game {
  constructor() {
    this.init();
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.onWindowResize);
    document.getElementById("container").appendChild(this.renderer.domElement);
    // 通过 JavaScript 添加一个样式规则来隐藏滚动条
    this.style = document.createElement("style");
    this.style.innerHTML = `
      body {
        overflow: hidden;
      }
    `;
    document.head.appendChild(this.style);
    console.log(this.map);
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
    this.loadCharacter("Cow");
  }
  async loadCharacter(characterName) {
    this.character = new Character(this.mixer);
    await this.character.loadCharacter(characterName);
    this.characterMesh = this.character.mesh;
    this.playerController = new PlayerController(
      this.camera,
      this.renderer.domElement,
      this.character
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

    // 继续下一帧
    requestAnimationFrame(this.render.bind(this));
  }
}
