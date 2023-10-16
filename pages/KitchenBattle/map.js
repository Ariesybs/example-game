import{Mesh,BoxGeometry,MeshBasicMaterial,DoubleSide} from "three"
export class Map extends Mesh{
    constructor(scene){
        super()
        this.scene = scene
        this.floorGeometry = new BoxGeometry(5, 5, 2); // 地板的大小
        this.floorMaterial = new MeshBasicMaterial({
        color: 0x808080,
        
        }); // 地板的材质
        
        this.geometry = this.floorGeometry;
        this.material = this.floorMaterial;
        this.position.set(0, -10, 0);
        this.name = "floor";
        this.rotation.x = Math.PI / 2; // 使地板水平
    }
}