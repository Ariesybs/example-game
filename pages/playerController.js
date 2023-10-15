import { TurnController } from "./turnController";
import { MoveController } from "./moveContraller";
export class PlayerController {
  constructor(camera, domElement, character, mixer) {
    this.turnController = new TurnController(camera, domElement);
    this.moveController = new MoveController(character, camera, mixer);
  }
}
