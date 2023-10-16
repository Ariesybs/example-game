import {AmbientLight,DirectionalLight} from "three"
export class Light {
    constructor(scene){
        this.scene = scene
    // 添加环境光
        this.ambientLight = new AmbientLight(0x404040); // 设置环境光颜色
        this.scene.add(this.ambientLight);

        // 添加直射光
        this.directionalLight = new DirectionalLight(0xffffff, 3); // 设置直射光颜色和强度
        this.directionalLight.position.set(10, 10, 10); // 设置光源位置
        this.scene.add(this.directionalLight);
    }

}