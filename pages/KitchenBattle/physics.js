import * as CANNON from "cannon"
import {BoxGeometry,Box3,Vector3} from "three"
import { PhysicsHelper } from "./physicsHelper"
/**
 * cannon 物理引擎
 */
export class Physics {
    constructor(scene) {
        this.scene = scene
        this.world = new CANNON.World() //物理世界
        this.world.gravity.set(0,-9.8,0) // 设置重力
        //碰撞检测 
        this.solver = new CANNON.GSSolver()
        this.world.solver = new CANNON.SplitSolver(this.solver)
        this.groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({ mass: 0 }); 
        this.groundBody.position.set(0, -10, 0); 
        console.log(this.groundBody)
        this.world.addBody(this.groundBody)
        //new PhysicsHelper(scene,this.groundShape,this.groundBody)
    }

    addPhysics(model,mass){
        //创建刚体
        const modelBody = new CANNON.Body({mass:mass})
    
        // 获取模型的包围盒
        const bbox = new Box3().setFromObject(model);

        // 获取模型的尺寸
        const size = new Vector3();
        bbox.getSize(size);
;

        console.log('模型的宽度：' + size.x);
        console.log('模型的高度：' + size.y);
        console.log('模型的深度：' + size.z);
        const modelShape = new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z))
        console.log(modelShape)
        //初始化刚体位置
        modelBody.position.set(model.position.x, model.position.y, model.position.z)
        
        //将初始化形状添加到刚体
        modelBody.addShape(modelShape)
        //加入物理世界
        this.modelBody = modelBody
        this.world.addBody(modelBody)
        this.physicsHelper = new PhysicsHelper(this.scene,modelShape,modelBody)
        return modelBody
    }


    update(){
        this.world.step(1/60) // 帧率设置为60
        if(this.modelBody){
            this.physicsHelper.update(this.modelBody)
        }
        
    }
}

