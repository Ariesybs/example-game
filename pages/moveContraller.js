export class MoveController {
  constructor(character, camera) {
    this.character = character;
    this.isMove = false;
    this.camera = camera;
    this.key = {};
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    document.addEventListener("keydown", (e) => {
      this.keydown(e);
    });
    document.addEventListener("keyup", (e) => {
      this.keyup(e);
    });
  }

  keydown = (e) => {
    this.key[e.key] = true;
  };

  keyup = (e) => {
    this.key[e.key] = false;
  };
}
