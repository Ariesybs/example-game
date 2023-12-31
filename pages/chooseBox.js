import {
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
  AudioLoader,
  LineSegments,
  LineBasicMaterial,
  EdgesGeometry,
  TextureLoader,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export class ChooseBox extends Mesh {
  constructor(scene, camera, renderer, mixer, mountedFunction) {
    super();
    this.components = [];
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mixer = mixer;
    this.mountedFunction = mountedFunction;
    this.audioLoader = new AudioLoader();
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.textureLoader = new TextureLoader();
    this.fontLoader = new FontLoader();
    this.loader = new GLTFLoader();
    this.width = 150;
    this.height = 105;
    this.modelList = [
      "BaseCharacter",
      "BlueSoldier_Female",
      "BlueSoldier_Male",
      "Casual_Bald",
      "Casual_Female",
      "Casual_Male",
      "Casual2_Female",
      "Casual2_Male",
      "Casual3_Female",
      "Casual3_Male",
      "Chef_Female",
      "Chef_Hat",
      "Chef_Male",
      "Cow",
      "Cowboy_Female",
      "Cowboy_Hair",
      "Cowboy_Male",
      "Doctor_Female_Old",
      "Doctor_Female_Young",
      "Doctor_Male_Old",
      "Doctor_Male_Young",
      "Elf",
      "Goblin_Female",
      "Goblin_Male",
      "Kimono_Female",
      "Kimono_Male",
      "Knight_Golden_Female",
      "Knight_Golden_Male",
      "Knight_Male",
      "Ninja_Female",
      "Ninja_Male",
      "Ninja_Male_Hair",
      "Ninja_Sand",
      "Ninja_Sand_Female",
      "OldClassy_Female",
      "OldClassy_Male",
      "Pirate_Female",
      "Pirate_Male",
      "Pug",
      "Soldier_Female",
      "Soldier_Male",
      "Suit_Female",
      "Suit_Male",
      "Viking_Female",
      "Viking_Male",
      "VikingHelmet",
      "Witch",
      "Wizard",
      "Worker_Female",
      "Worker_Male",
      "Zombie_Female",
      "Zombie_Male",
    ];
    this.curPage = 0;
    this.mainColor = 0xe5bd57;
    this.modelGrid = [];
    this.selectedModelName = null;
    this.preSelectedModleName = null;
    this.curCastedMesh = null;
    this.preCastedMesh = null;
    this.preOutLine = null;
    this.previewModel = null;
    this.arrow_l = null;
    this.arrow_r = null;
    this.start = null;
    this.callBack = null;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.geometry = new RoundedBoxGeometry(this.width, this.height, 1, 4, 2);
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
        const cellMaterial = new MeshBasicMaterial({ color: 0xe8f0fd });
        const cell = new Mesh(cellGeometry, cellMaterial);
        cell.position.set(cellX, cellY, 1);
        cell.userData.class = "character";
        this.components.push(cell);
        this.scene.add(cell);

        const edges = new EdgesGeometry(cell.geometry);
        //加入描边
        const outline = new LineSegments(
          edges,
          new LineBasicMaterial({ color: this.mainColor, linewidth: 2 })
        );
        outline.renderOrder = 1; // 保证描边在对象之上渲染
        cell.add(outline);
        cell.outline = outline;
        this.modelGrid.push(cell);
      }
    }
    this.updateCellsData();

    //创建开始游戏按钮
    this.textureLoader.load("/img/start.png", (texture) => {
      const startGeo = new BoxGeometry(23, 8);
      const startMat = new MeshBasicMaterial({
        transparent: true,
        map: texture,
      });
      const start = new Mesh(startGeo, startMat);

      start.position.set(-38, -35, 0);
      start.userData.class = "start";
      this.start = start;
      this.components.push(start);
      this.scene.add(start);
    });

    //创建翻页按钮

    /**arrow_r 右翻页*/
    this.textureLoader.load("/img/arrow_r.png", (texture) => {
      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
      });
      const geometry = new BoxGeometry(15, 15);
      const arrow_r = new Mesh(geometry, material);
      arrow_r.position.set(65, -45, 5); // 设置位置
      arrow_r.userData.class = "arrow";
      arrow_r.name = "arrow_r";
      this.arrow_r = arrow_r;
      this.components.push(arrow_r);
      this.scene.add(arrow_r);
    });

    /**arrow_r 左翻页*/
    this.textureLoader.load("/img/arrow_l.png", (texture) => {
      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
      });
      const geometry = new BoxGeometry(15, 15);
      const arrow_l = new Mesh(geometry, material);
      arrow_l.position.set(8, -45, 5); // 设置位置
      arrow_l.userData.class = "arrow";
      arrow_l.name = "arrow_l";
      this.arrow_l = arrow_l;
      arrow_l.visible = false;
      this.components.push(arrow_l);
      this.scene.add(arrow_l);
    });

    /**文字 */
    this.fontLoader.load("/font/gentilis_bold.typeface.json", (font) => {
      // 创建一个文字几何体
      const textGeometry = new TextGeometry("Your Character", {
        font: font, // 字体路径
        size: 6, // 文字大小
        height: 1, // 文字高度
      });

      // 创建一个文字材质
      const textMaterial = new MeshBasicMaterial({ color: this.mainColor });
      // 创建文字mesh
      const textMesh = new Mesh(textGeometry, textMaterial);
      this.titleText = textMesh;
      textMesh.position.set(-65, 40, 1);
      this.components.push(textMesh);
      this.scene.add(textMesh);
    });
  }

  initInteraction() {
    // 添加鼠标移动事件监听
    window.addEventListener("mousemove", this.handleMouseMove);

    window.addEventListener("click", this.handleMouseClick);
  }

  handleMouseMove = (event) => {
    this.onMouseMove(event);
  };

  handleMouseClick = () => {
    this.onMouseClick();
  };

  // 处理鼠标移动事件
  onMouseMove(event) {
    // 计算鼠标点击的位置
    const canvasBounds = this.renderer.domElement.getBoundingClientRect();
    const x =
      ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const y =
      -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    // 更新射线起点和方向
    this.mouse.set(x, y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 执行射线检测
    const castedArray = [...this.modelGrid];
    if (this.arrow_l !== null) castedArray.push(this.arrow_l);
    if (this.arrow_r !== null) castedArray.push(this.arrow_r);
    if (this.start !== null) castedArray.push(this.start);

    const intersects = this.raycaster.intersectObjects(castedArray);
    if (intersects.length > 0) {
      // 获取被选中的mesh

      this.curCastedMesh = intersects[0].object;
      if (!this.curCastedMesh.visible) return;
      if (this.preCastedMesh !== this.curCastedMesh) {
        if (this.preCastedMesh !== null) {
          this.preCastedMesh.scale.set(1, 1, 1);
        }
        const s = 1.1;
        this.curCastedMesh.scale.set(s, s, s);
        this.playAudio("choose");
        this.preCastedMesh = this.curCastedMesh;
      }
    } else {
      if (this.preCastedMesh !== null) {
        this.preCastedMesh.scale.set(1, 1, 1);
        this.preCastedMesh = null;
      }
    }
  }

  onMouseClick() {
    //未检测到物体，返回
    if (!this.curCastedMesh || !this.curCastedMesh.visible) return;
    if (
      this.selectedModelName !== this.curCastedMesh.name &&
      this.curCastedMesh !== null &&
      this.curCastedMesh.userData.class === "character"
    ) {
      this.selectedModelName = this.curCastedMesh.name;
      //加载模型
      this.loader.load(
        `/models/character/${this.selectedModelName}.gltf`,
        (gltf) => {
          const model = gltf.scene;
          const animations = gltf.animations;
          this.cheerAnimation = animations[14];
          this.cheerAction = this.mixer.clipAction(animations[14], model);
          // 创建一个动画混合器
          this.idleAction = this.mixer.clipAction(animations[2], model);
          this.idleAction.play();
          const s = 15;
          model.scale.set(s, s, s);
          model.position.set(-35, -25, 10);
          this.components.push(model);
          if (this.previewModel !== null) {
            this.scene.remove(this.previewModel);
          }
          this.previewModel = model;
          setTimeout(() => {
            this.scene.add(model);
          }, 100);
        }
      );
      this.checkSelected();
      this.playAudio("selected");
      this.preSelectedModleName = this.selectedModelName;
      // 翻页
    } else if (this.curCastedMesh.userData.class === "arrow") {
      this.playAudio("changePage");
      if (this.curCastedMesh.name === "arrow_l" && this.curPage > 0) {
        this.curPage -= 1;
      } else if (
        this.curCastedMesh.name === "arrow_r" &&
        this.curPage < this.modelList.length / 20 - 1
      ) {
        this.curPage += 1;
      }
      if (this.curPage <= 0) {
        this.arrow_l.visible = false;
      } else if (this.curPage >= this.modelList.length / 20 - 1) {
        this.arrow_r.visible = false;
      } else {
        this.arrow_l.visible = true;
        this.arrow_r.visible = true;
      }
      this.updateCellsData();
      console.log(this.curPage);
    } else if (this.curCastedMesh.userData.class === "start") {
      if (!this.selectedModelName) return;
      this.playAudio("gameStart");
      this.cheerAction.reset().play();
      this.cheerAction.setEffectiveTimeScale(1).setEffectiveWeight(1);
      this.idleAction.crossFadeTo(this.cheerAction, 0.3);
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("click", this.handleMouseClick);
      setTimeout(() => {
        this.callBack(this.selectedModelName);
      }, 3000);
    }
  }

  playAudio(name) {
    this.audioLoader.load(`/audio/${name}.mp3`, (buffer) => {
      // 创建一个AudioBufferSourceNode
      const source = this.audioContext.createBufferSource();

      // 将音频缓冲连接到AudioBufferSourceNode
      source.buffer = buffer;

      // 连接到音频输出
      source.connect(this.audioContext.destination);
      source.start(0);
    });
  }

  checkSelected() {
    if (!this.selectedModelName) return;
    this.modelGrid.forEach((cell) => {
      if (cell.name === this.selectedModelName) {
        cell.outline.material.color.set(0x00ff00);
      } else {
        cell.outline.material.color.set(this.mainColor);
      }
    });
  }

  updateCellsData() {
    let index = this.curPage * 20;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = this.modelGrid[i * 4 + j];
        if (index < this.modelList.length) {
          cell.visible = true;
          cell.name = this.modelList[index];
          cell.material.map = this.textureLoader.load(
            `/img/avatar/${cell.name}.png`
          );
          index++;
        } else {
          cell.visible = false;
        }
      }
    }
    this.checkSelected();
  }

  setCallBack(callBack) {
    this.callBack = callBack;
  }

  update(deltaTime){
    this.mixer.update(deltaTime)
  }
}
