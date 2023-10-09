/**
 * 手柄输入控制器
 */

import { MathUtils, Vector3, Vector2, Spherical } from "three";
import { StateMachine } from "./stateMachine";
export class GamepadManager {
  constructor(character, camera, mixer, orbitControls) {
    this.character = character;
    this.camera = camera;
    this.mouseX = 0;
    this.mouseY = 0;
    this.gamepads = [];
    this.stateMachine = new StateMachine(character, mixer);

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
        if (
          Math.abs(gamepad.axes[0]) > 0.5 ||
          Math.abs(gamepad.axes[1]) > 0.5
        ) {
          // 获取摄像机的前向方向（局部 Z 轴方向）
          const cameraDirection = new Vector3();
          this.camera.getWorldDirection(cameraDirection);

          // 获取手柄输入
          const inputDirection = new Vector3(
            gamepad.axes[0],
            0,
            gamepad.axes[1]
          );

          // 将手柄输入从世界坐标系转换为相机坐标系
          const inputInCameraSpace = inputDirection.applyQuaternion(
            this.camera.quaternion
          );

          // 计算模型需要旋转的角度，使用相机空间的输入
          const rotationAngle = Math.atan2(
            inputInCameraSpace.x,
            inputInCameraSpace.z
          );
          const rotationInDegrees = (rotationAngle * 180) / Math.PI;

          // 设置模型的旋转角度
          this.character.mesh.rotation.y =
            MathUtils.degToRad(rotationInDegrees);
          this.stateMachine.transitionToState("run");
          this.character.isRun = true;
        } else {
          this.stateMachine.transitionToState("idle");
          this.character.isRun = false;
        }
        // 获取手柄的右摇杆输入
        const gamepadRightStick = new Vector2();
        gamepadRightStick.x = gamepad.axes[2]; // 右摇杆 X 轴
        gamepadRightStick.y = gamepad.axes[5]; // 右摇杆 Y 轴

        // 设置旋转速度
        const rotationSpeed = 0.02; // 旋转速度

        // 根据右摇杆的输入计算水平和垂直旋转角度
        const horizontalRotationDelta = -gamepadRightStick.x * rotationSpeed;
        const verticalRotationDelta = -gamepadRightStick.y * rotationSpeed;

        // 计算相机的新位置
        const spherical = new Spherical().setFromVector3(
          this.camera.position.clone().sub(this.character.mesh.position)
        );
        spherical.theta += horizontalRotationDelta; // 水平旋转
        spherical.phi += verticalRotationDelta; // 垂直旋转

        // 限制垂直旋转的角度范围，防止相机翻转
        const minVerticalAngle = Math.PI / 4; // 最小垂直角度（根据需要调整）
        const maxVerticalAngle = 1.5; // 最大垂直角度（根据需要调整）
        spherical.phi = Math.max(
          minVerticalAngle,
          Math.min(maxVerticalAngle, spherical.phi)
        );

        console.log(gamepad.axes);

        // 计算新的相机位置
        const newCameraPosition = new Vector3()
          .setFromSpherical(spherical)
          .add(this.character.mesh.position);

        // 更新相机的位置
        this.camera.position.copy(newCameraPosition);
      }
    }

    requestAnimationFrame(() => this.handleGamepadInput());
  }

  startGamepadInputHandling() {
    this.handleGamepadInput();
  }
}
