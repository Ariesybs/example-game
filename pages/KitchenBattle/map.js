import{Mesh,BoxGeometry,MeshBasicMaterial,DoubleSide} from "three"
export class Map extends Mesh{
    constructor(scene){
        super()
        this.scene = scene
        this.floorGeometry = new BoxGeometry(50, 50, 0.01); // 地板的大小
        this.floorMaterial = new MeshBasicMaterial({
        color: 0xaaaaaa,
        
        }); // 地板的材质
        
        this.geometry = this.floorGeometry;
        this.material = this.floorMaterial;
        this.receiveShadow = true
        this.position.set(0, -11, 0);
        this.name = "floor";
        this.rotation.x = Math.PI / 2; // 使地板水平
    }
}