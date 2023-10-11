import {
  Scene,
  Color,
  Fog,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  Vector3,
} from "three";
import { HemiLight, DirLight } from "./light";
import { Map } from "./map";
import { Sky } from "./sky";
import { Character } from "./character";
import { PlayerController } from "./playerController";
import { GamepadManager } from "./gamepadManager";
import { UI } from "./ui";
import { ChooseBox } from "./chooseBox";
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
    this.scene = new Scene();
    this.scene.background = new Color().setHSL(0.6, 0, 1);
    this.scene.fog = new Fog(this.scene.background, 1, 5000);

    this.camera = new PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    this.camera.position.set(0, 0, 250);

    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.chooseBox = new ChooseBox(this.scene,this.camera,this.renderer);
    this.characterSelected = false
    this.clock = new Clock();
    this.mixer = new AnimationMixer();
    this.hemiLight = new HemiLight();
    this.dirLight = new DirLight();
    this.sky = new Sky(this.hemiLight, this.scene);
    this.scene.add(this.hemiLight);
    this.scene.add(this.dirLight);
    this.scene.add(this.sky);
    this.scene.add(this.chooseBox)
    this.render();
    //玩家选择完角色后再加载地图
    this.chooseBox.setCharacterSelectedCallback(()=>{
      this.map = new Map(this.scene);
      this.ui = new UI("container");
      this.v = 0;
      this.loadCharacter("Cow");
    })
    
    
  }
  async loadCharacter(characterName) {
    this.character = new Character(this.mixer);
    await this.character.loadCharacter(characterName);
    this.characterMesh = this.character.mesh;
    this.scene.add(this.characterMesh);
    this.playerController = new PlayerController(
      this.camera,
      this.renderer.domElement,
      this.character,
      this.mixer
    );
    this.gamepadManager = new GamepadManager(
      this.character,
      this.camera,
      this.mixer,
      this.playerController.turnController
    );
    this.loadMap();
    
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  loadMap() {
    this.scene.add(this.map);
  }

  move(){
    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }
    if (this.character.isRun) {
      if (this.v < 0.7) {
        this.v += 0.05;
      }
    } else {
      if (this.v > 0) this.v -= 0.05;
      else this.v = 0;
    }

    // 获取模型的本地Z轴
    var localZ = new Vector3(0, 0, 1);

    // 将本地Z轴转换为模型的世界坐标系
    localZ.applyQuaternion(this.character.mesh.quaternion);

    // 计算移动向量
    var moveDirection = localZ.clone().multiplyScalar(this.v);
    // 玩家模型的位置
    const playerPosition = this.character.mesh.position;

    // 更新模型的位置
    playerPosition.add(moveDirection);

    //摄像机时时跟随
    this.playerController.turnController.target.copy(
      new Vector3(playerPosition.x, playerPosition.y + 40, playerPosition.z)
    );
    this.camera.position.add(moveDirection); //lerp(this.camera.position.copy().add(moveDirection), 0.3); // 平滑过渡摄像机位置
    this.camera.lookAt(
      playerPosition.x,
      playerPosition.y + 40,
      playerPosition.z
    ); // 让摄像机始终看向玩家
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // 渲染逻辑
    

    // 继续下一帧
    requestAnimationFrame(this.render.bind(this));
  }
}
