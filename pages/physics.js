/**
 * 物理引擎
 */
import * as CANNON from 'cannon-es';

export class Physics {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0); // 设置重力

    // 添加碰撞检测配置
    const solver = new CANNON.GSSolver();
    this.world.solver = new CANNON.SplitSolver(solver);

    this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;

    this.characterBodies = []; // 用于存储角色的碰撞体
  }

  // 初始化地面
  initGround() {
    const groundMaterial = new CANNON.Material('groundMaterial');
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial,position:new CANNON.Vec3(0,-30,0) });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.addBody(groundBody);
  }

  // 在角色类中调用此方法以添加碰撞体
  addCharacterBody(body) {
    this.characterBodies.push(body);
  }

  // 更新物理世界
  update(deltaTime) {
    this.world.step(1 / 60, deltaTime, 3);
  }
}
