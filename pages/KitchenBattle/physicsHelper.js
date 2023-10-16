import {BoxGeometry,MeshBasicMaterial,Mesh,Box3,Vector3} from "three"
export class PhysicsHelper extends Mesh{
    constructor(scene,modelShape,modelBody){
        super()
        this.scene =scene
        this.modelBody = modelBody
        //创建辅助显示
        const geometry = new BoxGeometry(modelShape.halfExtents.x, modelShape.halfExtents.y, modelShape.halfExtents.z); // 这里的尺寸要根据模型形状来调整
        const material = new MeshBasicMaterial({ color: 0x00ff00 ,wireframe:true});
        this.geometry = geometry
        this.material = material
        this.position.copy(modelBody.position)
        this.quaternion.copy(modelBody.quaternion)
        this.scene.add(this)
    }

    update(modelBody){
        this.position.copy(modelBody.position)
        this.quaternion.copy(modelBody.quaternion)
    }
}