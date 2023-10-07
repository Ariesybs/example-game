import { Vector3 } from "three";
import {StateMachine} from "./stateMachine"
export class MoveController {
  constructor(character, camera,mixer) {
    this.character = character;
    this.isMove = false;
    this.camera = camera;
    this.stateMachine = new StateMachine(character,mixer)
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    document.addEventListener("keydown", (e) => {
      this.keydown(e);
      });
    document.addEventListener("keyup", (e) => {
      this.keyup(e);
    });

    this.keys = {
      W:false,
      A:false,
      S:false,
      D:false
    }
  }

  keydown = (e) => {
    //输入检测
    const validInput = ["A","a","W","w","S","s","D","d"]
    if(validInput.indexOf(e.key) === -1) return

    var targetDirection = new Vector3(); // 初始化目标方向
    var cameraDirection = new Vector3();
    this.camera.getWorldDirection(cameraDirection);
    // 根据不同的按键输入计算不同的目标方向
    if (e.key === "A" || e.key === "a") {
      this.keys.A = true
        // 向左旋转90°
        targetDirection.set(cameraDirection.z, 0, -cameraDirection.x);
    } else if (e.key === "D" || e.key === "d") {
      this.keys.D = true
        // 向右旋转90°
        targetDirection.set(-cameraDirection.z, 0, cameraDirection.x);
    } else if (e.key === "W" || e.key === "w") {
      this.keys.W = true
        // 向前旋转90°
        targetDirection.set(cameraDirection.x, 0, cameraDirection.z);
    } else if (e.key === "S" || e.key === "s") {
      this.keys.S = true
        // 向后旋转90°
        targetDirection.set(-cameraDirection.x, 0, -cameraDirection.z);
    }

    // 使用模型的lookAt方法将模型朝向新的目标方向
    this.character.mesh.lookAt(this.character.mesh.position.clone().add(targetDirection));

    this.character.isRun = this.keys.A || this.keys.D || this.keys.S || this.keys.W
    if(this.character.isRun){
      this.stateMachine.transitionToState("run")
    }
    
  };

  keyup = (e) => {
    //输入检测
    const validInput = ["A","a","W","w","S","s","D","d"]
    if(validInput.indexOf(e.key) === -1) return

    if (e.key === "A" || e.key === "a") {
      this.keys.A = false
    } else if (e.key === "D" || e.key === "d") {
      this.keys.D = false
    } else if (e.key === "W" || e.key === "w") {
      this.keys.W = false
    } else if (e.key === "S" || e.key === "s") {
      this.keys.S = false
    }
    this.character.isRun = this.keys.A || this.keys.D || this.keys.S || this.keys.W
    if(!this.character.isRun){
      this.stateMachine.transitionToState("idle")
    }
  };

  move = ()=>{

  }
}
