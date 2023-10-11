import { Mesh, BoxGeometry, MeshBasicMaterial,Raycaster,Vector2,AudioLoader,LineSegments,LineBasicMaterial,EdgesGeometry,Sprite } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
export class ChooseBox extends Mesh {
  constructor(scene,camera,renderer,mixer) {
    super();
    this.scene = scene;
    this.camera = camera
    this.renderer = renderer
    this.mixer = mixer
    this.audioLoader = new AudioLoader()
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.loader = new GLTFLoader()
    this.width = 150;
    this.height = 100;
    this.modelList = ["BaseCharacter","BlueSoldier_Female","BlueSoldier_Male","Casual_Bald","Casual_Female",
                      "Casual_Male","Casual2_Female","Casual2_Male","Casual3_Female","Casual3_Male",
                      "Chef_Female","Chef_Hat","Chef_Male","Cow","Cowboy_Female",
                      "Cowboy_Hair","Cowboy_Male","Doctor_Female_Old","Doctor_Female_Young","Doctor_Male_Old"];
    this.modelGrid = [];
    this.selectedMesh = null
    this.preSelectedMesh = null
    this.curCastedMesh = null
    this.preCastedMesh = null
    this.preOutLine = null
    this.previewModel = null
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
          4,
          20
        );
        const cellMaterial = new MeshBasicMaterial({ color: 0x888888 });
        const cell = new Mesh(cellGeometry, cellMaterial);
        cell.position.set(cellX, cellY, 1);
        this.scene.add(cell);
        this.modelGrid.push(cell);

        const modelName = this.modelList[i*gridCols+j]
        cell.modelName = modelName
        
      }
    }

    //创建开始
    const startGeo = new RoundedBoxGeometry(
      40,
      8,
      1,
      4,
      20
    );
    const startMat = new MeshBasicMaterial({ color: 0xffffff });
    const start = new Mesh(startGeo, startMat);
    start.position.set(-38, -35, 5);
    this.scene.add(start);
 
    // 创建文本元素
    const textElement = document.createElement('div');
    this.modelTextElement = textElement
    textElement.innerHTML = ''; // 替换为你的模型名称
    textElement.style.position = 'absolute';
    textElement.style.top = '50px'; // 调整文本在页面上的位置
    textElement.style.left = '45%';
    textElement.style.color = 'black';
    // 使用CSS样式来调整字体大小和加粗
    textElement.style.fontFamily = 'Arial'; // 设置字体
    textElement.style.fontSize = '40px'; // 设置字体大小
    textElement.style.fontWeight = 'bold'; // 设置为加粗字体
    document.body.appendChild(textElement);

    // 创建文本元素
    const previewTextElement = document.createElement('div');
    this.previewTextElement = previewTextElement
    previewTextElement.innerHTML = ''; // 替换为你的模型名称
    previewTextElement.style.position = 'absolute';
    previewTextElement.style.top = '20%'; // 调整文本在页面上的位置
    previewTextElement.style.left = '30%';
    previewTextElement.style.color = 'white';
    // 使用CSS样式来调整字体大小和加粗
    previewTextElement.style.fontFamily = 'Arial'; // 设置字体
    previewTextElement.style.fontSize = '40px'; // 设置字体大小
    previewTextElement.style.fontWeight = 'bold'; // 设置为加粗字体
    document.body.appendChild(previewTextElement);
  }
  

  

  initInteraction(){
    // 添加鼠标移动事件监听
    window.addEventListener('mousemove', (event) => {
      this.onMouseMove(event);
    });

    window.addEventListener("click",()=>{
      this.onMouseClick()
    })
  }

  // 处理鼠标移动事件
  onMouseMove(event) {
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
      this.curCastedMesh = intersects[0].object;
      if(this.preCastedMesh !== this.curCastedMesh){
        if(this.preCastedMesh!==null){
          this.preCastedMesh.scale.set(1,1,1)
        }
        const s = 1.1
        this.curCastedMesh.scale.set(s,s,s)
        this.playChooseAudio()
        this.preCastedMesh = this.curCastedMesh
        this.modelTextElement.innerHTML = this.curCastedMesh.modelName
      }
    }else {
      if(this.preCastedMesh!==null){
        this.preCastedMesh.scale.set(1,1,1)
        this.preCastedMesh = null
        this.curCastedMesh = null
        this.modelTextElement.innerHTML = ""
      }
      
    }
  }

  onMouseClick(){
    if(this.selectedMesh !== this.curCastedMesh && this.curCastedMesh !== null){
      this.selectedMesh = this.curCastedMesh
      //加载模型
      this.loader.load(`/models/character/${this.selectedMesh.modelName}.gltf`,(gltf)=>{
        const model = gltf.scene;
        const animations = gltf.animations;
        // 创建一个动画混合器
        const idleAction = this.mixer.clipAction(animations[15],model);
        console.log(idleAction)
        idleAction.play()
        const s = 15
        model.scale.set(s,s,s)
        model.position.set(-35,-25,10)
        if(this.previewModel !== null){
          this.scene.remove(this.previewModel)
        }
        this.previewModel = model
        setTimeout(()=>{
          this.previewTextElement.innerHTML = this.selectedMesh.modelName
          this.scene.add(model)
        },100)
        
      })
      if(this.selectedMesh !== this.preSelectedMesh && this.preSelectedMesh!==null){
        this.preSelectedMesh.remove(this.preOutLine)
      }
      this.playSlectedAudio()
      this.addOutline(this.selectedMesh)
      this.preSelectedMesh = this.selectedMesh
    }
    
  }
  // 在构造函数中创建一个辅助函数来绘制描边
 addOutline(mesh) {
  const edges = new EdgesGeometry(mesh.geometry);
  const outline = new LineSegments(edges, new LineBasicMaterial({ color: 0x00ff00,linewidth:2}));
  outline.renderOrder = 1; // 保证描边在对象之上渲染
  mesh.add(outline);
  this.preOutLine = outline
}


  playChooseAudio(){
    
    this.audioLoader.load('/audio/choose.mp3',(buffer)=>{
      // 创建一个AudioBufferSourceNode
    const source = this.audioContext.createBufferSource();

    // 将音频缓冲连接到AudioBufferSourceNode
    source.buffer = buffer;

    // 连接到音频输出
    source.connect(this.audioContext.destination);
    source.start(0)
    })
  }

  playSlectedAudio(){
    this.audioLoader.load('/audio/selected.mp3',(buffer)=>{
      // 创建一个AudioBufferSourceNode
    const source = this.audioContext.createBufferSource();

    // 将音频缓冲连接到AudioBufferSourceNode
    source.buffer = buffer;

    // 连接到音频输出
    source.connect(this.audioContext.destination);
    source.start(0)
    })
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
