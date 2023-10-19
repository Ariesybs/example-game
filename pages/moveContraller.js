import { Vector3 ,Quaternion} from "three";
import {Vec3} from "cannon-es"
import { StateMachine } from "./stateMachine";
export class MoveController {
  constructor(character, camera, mixer) {
    this.character = character;
    this.isMove = false;
    this.camera = camera;
    this.physicsBody = character.physicsBody
    //this.stateMachine = new StateMachine(character, mixer);
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    document.addEventListener("keydown", (e) => {
      this.keydown(e);
    });
    document.addEventListener("keyup", (e) => {
      this.keyup(e);
    });

    this.keys = {};
  }

  keydown = (e) => {
   this.keys[e.code] = true
  };

  keyup = (e) => {
    this.keys[e.code] = false
  };

  update(){
    const cameraDirection = new Vector3(0, 0, -1);/* 获取摄像机朝向的向量 */
    
    this.camera.getWorldDirection(cameraDirection);
    const moveDirection = new Vec3(0, 0, 0);
    if (this.keys.KeyW) {
      cameraDirection.y = 0
      moveDirection.vadd(cameraDirection, moveDirection); // 向前
    }
    if (this.keys.KeyS) {
      cameraDirection.y = 0
      const backwardDirection = cameraDirection.clone().negate(); // 创建一个后退方向的向量
      moveDirection.vadd(backwardDirection, moveDirection); // 向后
    }
    if (this.keys.KeyA) {
      const leftVector = new Vector3(-1, 0, 0); // 向左的向量
      leftVector.applyQuaternion(this.camera.quaternion); // 根据摄像机方向旋转向左的向量
      moveDirection.vadd(leftVector, moveDirection); // 向左
    }
    if (this.keys.KeyD) {
      const rightVector = new Vector3(1, 0, 0); // 向右的向量
      rightVector.applyQuaternion(this.camera.quaternion); // 根据摄像机方向旋转向右的向量
      moveDirection.vadd(rightVector, moveDirection); // 向右
    }
    
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      moveDirection.scale(1, moveDirection);
      
      const bodyPosition = this.physicsBody.position.clone().vadd(moveDirection)
      this.physicsBody.position.copy(bodyPosition)

      // 计算模型的目标旋转四元数
      const targetQuaternion = new Quaternion();
      targetQuaternion.setFromUnitVectors(new Vector3(0, 0, 1), moveDirection);

      // 逐渐插值当前旋转和目标旋转
      const speed = 0.1; // 调整这个值来控制旋转速度
      //this.physicsBody.quaternion.slerp(targetQuaternion, speed);
      this.physicsBody.quaternion.copy(targetQuaternion);

    }
  }
}
