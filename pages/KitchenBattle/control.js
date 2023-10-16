import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export class Control{
    constructor(camera,renderer){
        this.camera = camera
        this.renderer = renderer
        //OrbitControl
        this.orbitControls = new OrbitControls(camera,renderer.domElement)
        this.orbitControls.enableDamping = true; // 启用阻尼效果，使摄像机平滑移动
        this.orbitControls.dampingFactor = 0.05; // 调整阻尼因子
    }
}