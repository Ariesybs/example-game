/**
 * 人物动作状态机
 */
import {LoopOnce} from "three"

export class StateMachine {
  constructor(character,mixer) {
    this.STATES = {
      IDLE:"idle",
      RUN:"run",
      JUMP:"jump",
      ROLL:"roll"
    }; // 存储状态

    this.currentState = this.STATES.IDLE; // 当前状态
    this.character = character
    this.animations = character.animations
    this.mixer = mixer
    this.idleAction = mixer.clipAction(this.animations["idle"],this.character.mesh)
    this.runAction  = mixer.clipAction(this.animations["run"],this.character.mesh)
    this.jumpAction = mixer.clipAction(this.animations["jump"],this.character.mesh)
 
    this.rollAction = mixer.clipAction(this.animations["roll"],this.character.mesh)
    this.isLocked = false
    this.currentAction = this.idleAction
    
  }
    transitionToState(newState) {
    if (this.currentState === newState || this.isLocked) {
        return;
    }
    
    switch(newState){
      case this.STATES.IDLE:
        this.stateCross(this.idleAction,0.5)
        break
      case this.STATES.RUN:
        this.stateCross(this.runAction,0.5)
        break
      case this.STATES.JUMP:
        if(!this.isLocked){
          this.preAction = this.currentAction
          this.isLocked = true
          this.jumpAction.loop = LoopOnce;
          this.stateCross(this.jumpAction,0.2)
         setTimeout(() => {
            this.isLocked = false;
            this.stateCross(this.preAction,0.5)
          },550)
        }
      case this.STATES.ROLL:
        if(!this.isLocked){
          this.preAction = this.currentAction
          this.isLocked = true
          this.rollAction.loop = LoopOnce;
          this.stateCross(this.rollAction,0.1)
         setTimeout(() => {
            this.isLocked = false;
            this.stateCross(this.preAction,0.5)
          },650)
        }
    }

    this.currentState = newState;
}



stateCross(targetAction,crossTime){
  targetAction.reset().play();
  targetAction.setEffectiveTimeScale(1).setEffectiveWeight(1);
  this.currentAction.crossFadeTo(targetAction, crossTime);
  this.currentAction = targetAction
}

}
