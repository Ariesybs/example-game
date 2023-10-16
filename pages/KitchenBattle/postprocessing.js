/**
 * 后处理模块，高光显示
 */
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import {Vector2} from "three"

export class PostProcessing extends EffectComposer{
    constructor(renderer,scene,camera){
        super(renderer)
        //高亮后处理
        this.scene = scene
        this.camera = camera
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.addPass(this.renderPass);
        this.outlinePass = new OutlinePass(
        new Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
        );
        this.addPass(this.outlinePass);
        /**参数调节 */
        this.outlinePass.renderToScreen = true;
        this.outlinePass.edgeStrength = 5; // 粗
        //this.outlinePass.visibleEdgeColor.set("green"); // 设置显示的颜色
        this.outlinePass.selectedObjects = [];
        /**抗锯齿处理 */
        this.fxaaPass = new ShaderPass(FXAAShader);
        const pixelRatio = this.renderer.getPixelRatio();
        this.fxaaPass.material.uniforms["resolution"].value.x =
        1 / (window.innerWidth * pixelRatio);
        this.fxaaPass.material.uniforms["resolution"].value.y =
        1 / (window.innerHeight * pixelRatio);
        this.addPass(this.fxaaPass);

        //材质通道处理
        this.outputPass = new OutputPass();
        this.addPass(this.outputPass);
    }

    setOutLine(obj){
        this.outlinePass.selectedObjects = obj
    }
}