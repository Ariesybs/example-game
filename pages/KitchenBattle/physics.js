import * as CANNON from "cannon-es"
import {BoxGeometry,Box3,Vector3} from "three"
import { PhysicsHelper } from "./physicsHelper"
/**
 * cannon 物理引擎
 */
export class Physics {
    constructor(scene) {
        this.scene = scene
        this.world = new CANNON.World() //物理世界
        this.world.gravity.set(0,-40,0) // 设置重力
        //碰撞检测 
        this.solver = new CANNON.GSSolver()
        this.world.solver = new CANNON.SplitSolver(this.solver)
        this.groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({ 
            mass: 0,
            shape:this.groundShape,

        });
        this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
        //this.groundBody.addShape(this.groundShape) 
        this.groundBody.position.set(0, -10, 0); 
        console.log(this.groundBody)
        this.world.addBody(this.groundBody)
        //new PhysicsHelper(scene,this.groundShape,this.groundBody)
    }

    addPhysics(model,mass){
        
        const trimeshShape = new CANNON.Trimesh(
            model.geometry.attributes.position.array,
            model.geometry.index.array
        )
        //创建刚体
        const modelBody = new CANNON.Body({mass:mass})
 
        //初始化刚体位置
        modelBody.position.set(model.position.x, model.position.y, model.position.z)
        
        //将初始化形状添加到刚体
        modelBody.addShape(trimeshShape)
        //加入物理世界
        this.modelBody = modelBody
        this.world.addBody(modelBody)
        //this.physicsHelper = new PhysicsHelper(this.scene,trimeshShape,modelBody)
        return modelBody
    }

    


    update(deltatime){
        this.world.step(1/60,deltatime) // 帧率设置为60
        // if(this.modelBody){
        //     this.physicsHelper.update(this.modelBody)
        // }
        
    }
}

