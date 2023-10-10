import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
export class ChooseBox extends Mesh {
  constructor(scene) {
    super();
    this.scene = scene;
    this.width = 150;
    this.height = 100;
    this.modeelList = [];
    this.geometry = new BoxGeometry(this.width, this.height, 1);
    this.material = new MeshBasicMaterial({
      color: 0x333333,
      opacity: 0.8,
      transparent: true,
    });
    this.initChooseArea();
  }

  initChooseArea() {
    // 创建模型选择区域
    const gridRows = 4;
    const gridCols = 4;
    const spacing = 1; // 设置间隔大小
    const cellSize = (this.width / 2 - (gridCols + 1) * spacing) / gridCols; // 计算单元格大小
    const modelGrid = [];

    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridCols; j++) {
        const cellX =
          this.width / 2 - spacing - j * (cellSize + spacing) - cellSize / 2; // 计算X坐标，保持在右半边区域
        const cellY =
          this.height / 2 - spacing - i * (cellSize + spacing) - cellSize / 2; // 计算Y坐标，保持在上半边区域

        const cellGeometry = new RoundedBoxGeometry(
          cellSize,
          cellSize,
          1,
          10,
          10,
          2
        );
        const cellMaterial = new MeshBasicMaterial({ color: 0xffffff });
        const cell = new Mesh(cellGeometry, cellMaterial);
        cell.position.set(cellX, cellY, 1);
        this.scene.add(cell);

        modelGrid.push(cell);
      }
    }
  }
}
