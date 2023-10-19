import { TurnController } from "./turnController";
import { MoveController } from "./moveContraller";
export class PlayerController {
  constructor(camera, target, character, mixer) {
    this.turnController = new TurnController(camera, target);
    this.moveController = new MoveController(character, camera, mixer);
  }

  update(){
    this.turnController.update()
    this.moveController.update()

  }
}
