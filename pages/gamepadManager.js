import {MathUtils} from "three"
import { StateMachine } from "./stateMachine";
export class GamepadManager {
    constructor(character,mixer) {
        this.character = character
        this.gamepads = [];
        this.stateMachine = new StateMachine(character,mixer)

        window.addEventListener("gamepadconnected", (event) => {
            this.handleGamepadConnected(event.gamepad);
        });

        window.addEventListener("gamepaddisconnected", (event) => {
            this.handleGamepadDisconnected(event.gamepad);
        });

        this.startGamepadInputHandling();
    }

    handleGamepadConnected(gamepad) {
        console.log(`游戏手柄已连接：${gamepad.id}`);
        this.gamepads[gamepad.index] = gamepad;
    }

    handleGamepadDisconnected(gamepad) {
        console.log(`游戏手柄已断开：${gamepad.id}`);
        delete this.gamepads[gamepad.index];
    }

    handleGamepadInput() {
        const connectedGamepads = navigator.getGamepads();

        for (const gamepad of connectedGamepads) {
            if (gamepad) {
                for (let i = 0; i < gamepad.buttons.length; i++) {
                    if (gamepad.buttons[i].pressed) {
                        console.log(`按钮  被按下`);
                        // 在这里执行相应的操作
                    }
                }
                if(Math.abs(gamepad.axes[0]) > 0.5 || Math.abs(gamepad.axes[1]) > 0.5){
                    // 获取手柄的旋转角度（弧度）
                 const rotationAngle = Math.atan2(gamepad.axes[0], gamepad.axes[1]);

                 // 将弧度转换为角度
                 const rotationInDegrees = (rotationAngle * 180) / Math.PI;
 
                 // 计算模型需要旋转的角度（例如：手柄一圈对应模型一圈）
                 const modelRotation = (rotationInDegrees + 360) % 360;

                 this.character.mesh.rotation.y = MathUtils.degToRad(modelRotation);
                 this.stateMachine.transitionToState("run")
                 this.character.isRun = true
                }else{
                    this.stateMachine.transitionToState("idle")
                    this.character.isRun = false
                }
                 
            }
        }

        requestAnimationFrame(() => this.handleGamepadInput());
    }

    startGamepadInputHandling() {
        this.handleGamepadInput();
    }
}

