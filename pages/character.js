import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LoopOnce } from "three";
export class Character {
  constructor(mixer) {
    this.loader = new GLTFLoader();
    this.mixer = mixer;
    this.isRun = false;
    this.isJump =false;
    this.isRoll = false;
  }

  async loadCharacter(characterName) {
    try {
      const data = await this.createCharacter(characterName);

      this.mesh = data.mesh;
      this.animations = data.animations;
      this.playAnimation("idle");
    } catch (error) {
      console.error("Error loading character:", error);
    }
  }

  createCharacter(characterName) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        `/models/${characterName}.gltf`,
        (gltf) => {
          const model = gltf.scene;

          // 遍历模型的所有子元素，为其材质启用阴影接收
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true; // 启用投射阴影
              child.receiveShadow = true; // 启用接收阴影
            }
          });
          const mesh = model.children[0];
          if (mesh) {
            const s = 8;
            mesh.scale.set(s, s, s);
            mesh.position.y = -30;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
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
            const animations = {};
            for (let i = 0; i < gltf.animations.length; i++) {
              animations[state[i]] = gltf.animations[i];
            }

            const data = {
              mesh: mesh,
              animations: animations,
            };
            resolve(data); // 模型加载成功，解析 Promise 并传递模型与动画
          } else {
            reject(new Error("Failed to load character model."));
          }
        },
        undefined,
        reject
      );
    });
  }

  playAnimation(animationName) {

    const action = this.mixer.clipAction(
      this.animations[animationName],
      this.mesh
    );
    
    if (animationName === "jump") {
      action.setLoop(LoopOnce); // 设置为仅播放一次
      // 当动画播放完成时，停止动画
      action.clampWhenFinished = true;
      //action.addEventListener("finished", this.playAnimation("idle"));
    }
    if (action) {
      // 停止当前的动作（如果有）
      this.mixer.stopAllAction();

      // 重置动作
      action.reset();

      // 播放动作
      action.play();
    } else {
      console.warn(`Animation "${animationName}" not found.`);
    }
  }

  update(deltaTime) {
    // 更新混合器，用于播放动画
    this.mixer.update(deltaTime);
  }
}
