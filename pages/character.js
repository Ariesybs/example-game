import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoopOnce,Vector3 } from "three";
import { PlayerController } from "./playerController";
import { GamepadManager } from "./gamepadManager";
import * as CANNON from "cannon-es";
export class Character {
  constructor(mixer,camera,scene,physics,characterName) {
    this.loader = new GLTFLoader();
    this.mixer = mixer;
    this.camera = camera;
    this.scene = scene;
    this.physics = physics
    this.v= 0
    this.isRun = false;
    this.isJump =false;
    this.isRoll = false;
    this.loadCharacter(characterName)
  }

  init(){
    // 创建胶囊体
    const radius = 5;
    const height = 10;
    const mass = 1;
    const body = new CANNON.Body({ mass });
    const shape = new CANNON.Cylinder(radius, radius, height, 20);
    body.addShape(shape);
    body.position.copy(new CANNON.Vec3(0,-30,0));
    this.physics.world.addBody(body);

    // 将角色的碰撞体添加到物理类
    this.physics.addCharacterBody(body);
  }

  async loadCharacter(characterName) {

    await this.loader.load(
      `/models/character/${characterName}.gltf`,
      (gltf) => {
        const model = gltf.scene;

        // 遍历模型的所有子元素，为其材质启用阴影接收
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true; // 启用投射阴影
            child.receiveShadow = true; // 启用接收阴影
          }
        });
       this.model = model.children[0];
        if (this.model) {
          const s = 8;
          this.model.scale.set(s, s, s);
          this.model.position.y = -30;
          this.model.castShadow = true;
          this.model.receiveShadow = true;
          const state = [
            "die",
            "mad",
            "idle",
            "jump",
            "pick",
            "attack_sword",
            "hit",
            "roll",
            "run",
            "run_gun",
            "shoot",
            "sit_down",
            "sit_up",
            "throw",
            "cheer",
            "walk",
            "walk_gun",
          ];
          this.animations = {};
          for (let i = 0; i < gltf.animations.length; i++) {
            this.animations[state[i]] = gltf.animations[i];
          }
          this.mixer.clipAction(
          this.animations["idle"],
          this.model
          ).reset().play()

          this.scene.add(this.model)

        } 
        this.loadConyroller() //加载控制器
      }
    );
  
      
  }

  loadConyroller(){
    //键鼠控制器
    this.playerController = new PlayerController(
      this.camera,
      this.model.position,
      this,
      this.mixer
    );
    //手柄控制器
    // this.gamepadManager = new GamepadManager(
    //   this,
    //   this.camera,
    //   this.mixer
    // );
  }


  move() {
    if (this.isRun) {
      if (this.v < 0.7) {
        this.v += 0.05;
      }
    } else {
      if (this.v > 0) this.v -= 0.05;
      else this.v = 0;
    }

    if(this.model){
      // 获取模型的本地Z轴
    var localZ = new Vector3(0, 0, 1);

    // 将本地Z轴转换为模型的世界坐标系
    localZ.applyQuaternion(this.model.quaternion);

    // 计算移动向量
    var moveDirection = localZ.clone().multiplyScalar(this.v);
    // 玩家模型的位置
    const playerPosition = this.model.position;

    // 更新模型的位置
    playerPosition.add(moveDirection);


    this.camera.position.add(moveDirection); //lerp(this.camera.position.copy().add(moveDirection), 0.3); // 平滑过渡摄像机位置

    }
    
  }

  update(deltaTime) {
    // 更新混合器，用于播放动画
    this.mixer.update(deltaTime);
    this.move()

  }
}
