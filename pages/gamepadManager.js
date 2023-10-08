/**
 * 手柄输入控制器
 */

import {MathUtils,Vector3,Vector2} from "three"
import { StateMachine } from "./stateMachine";
export class GamepadManager {
    constructor(character,camera,mixer,orbitControls) {
        this.character = character
        this.camera = camera
        this.mouseX = 0;
        this.mouseY = 0;
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
                        console.log(`按钮${i}被按下`);
                        // 在这里执行相应的操作
                    }
                }
                if (Math.abs(gamepad.axes[0]) > 0.5 || Math.abs(gamepad.axes[1]) > 0.5) {
                    // 获取摄像机的前向方向（局部 Z 轴方向）
                    const cameraDirection = new Vector3();
                    this.camera.getWorldDirection(cameraDirection);
                
                    // 获取手柄输入
                    const inputDirection = new Vector3(gamepad.axes[0], 0, gamepad.axes[1]);
                
                    // 将手柄输入从世界坐标系转换为相机坐标系
                    const inputInCameraSpace = inputDirection.applyQuaternion(this.camera.quaternion);
                
                    // 计算模型需要旋转的角度，使用相机空间的输入
                    const rotationAngle = Math.atan2(inputInCameraSpace.x, inputInCameraSpace.z);
                    const rotationInDegrees = (rotationAngle * 180) / Math.PI;
                
                    // 设置模型的旋转角度
                    this.character.mesh.rotation.y = MathUtils.degToRad(rotationInDegrees);
                    this.stateMachine.transitionToState("run");
                    this.character.isRun = true;
                } else {
                    this.stateMachine.transitionToState("idle");
                    this.character.isRun = false;
                }
                // 获取手柄的右摇杆输入
                const gamepadRightStick = new Vector2();
                gamepadRightStick.x = gamepad.axes[2]; // 右摇杆 X 轴
                gamepadRightStick.y = gamepad.axes[3]; // 右摇杆 Y 轴
                
                // 更新鼠标位置
                const sensitivity = 2; // 调整灵敏度
                this.mouseX += gamepadRightStick.x * sensitivity;
                this.mouseY += gamepadRightStick.y * sensitivity;
                console.log(this.mouseX)
                // 模拟鼠标移动
                document.dispatchEvent(new MouseEvent('mousemove', { clientX: this.mouseX, clientY: this.mouseY }));
                
                // 检测右摇杆按下事件
                if (gamepad.buttons[14].pressed) { // 右摇杆按下的按钮索引可能不同
                    // 模拟鼠标单击事件
                    document.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
                    document.dispatchEvent(new MouseEvent('mouseup', { button: 0 }));
                }
                
                
                 
            }
        }

        requestAnimationFrame(() => this.handleGamepadInput());
    }

    startGamepadInputHandling() {
        this.handleGamepadInput();
    }
}

