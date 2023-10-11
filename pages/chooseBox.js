import { Mesh, BoxGeometry, MeshBasicMaterial,Raycaster,Vector2 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
export class ChooseBox extends Mesh {
  constructor(scene,camera,renderer) {
    super();
    this.scene = scene;
    this.camera = camera
    this.renderer = renderer
    this.width = 150;
    this.height = 100;
    this.modelList = [];
    this.modelGrid = [];
    this.selectedMesh = null
    this.raycaster = new Raycaster()
    this.mouse = new Vector2() 
    this.geometry = new BoxGeometry(this.width, this.height, 1);
    this.material = new MeshBasicMaterial({
      color: 0x333333,
      opacity: 0.8,
      transparent: true,
    });
    this.onCharacterSelected = null; // 初始化回调函数为null
    this.initChooseArea();
    this.initInteraction();
  }

  initChooseArea() {
    // 创建模型选择区域
    const gridRows = 5; //行
    const gridCols = 4; //列
    const spacing = 2; // 设置间隔大小
    const cellSize = (this.width / 2 - (gridCols + 1) * spacing) / gridCols; // 计算单元格大小
    

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

        this.modelGrid.push(cell);
      }
    }
  }

  initInteraction(){
    // 添加点击事件监听
    window.addEventListener('click', (event) => {
      this.onMouseClick(event);
    });
  }

  // 处理鼠标点击事件
  onMouseClick(event) {
    // 计算鼠标点击的位置
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    // 更新射线起点和方向
    this.mouse.set(x, y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 执行射线检测
    const intersects = this.raycaster.intersectObjects(this.modelGrid);

    if (intersects.length > 0) {
      // 获取被选中的mesh
      const clickedMesh = intersects[0].object;

      // 现在你可以处理被选中的mesh
      console.log('Selected mesh:', clickedMesh);

      // 存储选中的mesh
      this.selectedMesh = clickedMesh;

      // 调用回调函数通知角色选择完成
      //this.selectCharacter(this.selectedMesh.userData.character);
    }
  }

  selectCharacter(character) {
    // 角色选择逻辑...

    // 如果已经设置了回调函数，则调用它
    if (this.onCharacterSelected) {
      this.onCharacterSelected();
    }
  }

  // 设置回调函数
  setCharacterSelectedCallback(callback) {
    this.onCharacterSelected = callback;
  }
}
