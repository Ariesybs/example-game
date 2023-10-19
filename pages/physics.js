/**
 * 物理引擎
 */
import * as CANNON from 'cannon-es';
import * as THREE from "three"
export class Physics {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0); // 设置重力

    // 添加碰撞检测配置
    const solver = new CANNON.GSSolver();
    this.world.solver = new CANNON.SplitSolver(solver);

    this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;
    this.models = [] //存储模型
    this.bodies = []; // 用于存储角色的碰撞体
    this.initGround()
  }

  // 初始化地面
  initGround() {
    const groundMaterial = new CANNON.Material('groundMaterial');
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial,position:new CANNON.Vec3(0,-25,0) });
    this.groundBody = groundBody
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.addBody(groundBody);
  }


  // 添加碰撞体
  addPhysics(model,body) {
    this.models.push(model)
    this.bodies.push(body);
  }

  // 更新物理世界
  update(deltaTime) {
    this.world.step(1 / 60, deltaTime, 3);
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];
      const body = this.bodies[i];
      model.position.copy(body.position).add(new THREE.Vector3(0,-13,0))
      model.quaternion.copy(body.quaternion)
      
    }
  }
}
