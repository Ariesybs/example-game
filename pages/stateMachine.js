export class StateMachine {
  constructor(character,mixer) {
    this.STATES = {
      IDLE:"idle",
      RUN:"run"
    }; // 存储状态
    this.currentState = this.STATES.IDLE; // 当前状态
    this.character = character
    this.animations = character.animations
    this.mixer = mixer
    this.idleAction = mixer.clipAction(this.animations["idle"],this.character.mesh)
    this.runAction  = mixer.clipAction(this.animations["run"],this.character.mesh)
  }
    transitionToState(newState) {
    if (this.currentState === newState) {
        return;
    }

    if (newState === this.STATES.IDLE) {
        // 从运动到静止的平滑过渡
        const crossFadeDuration = 0.5; // 过渡时间
        this.idleAction.reset().play();
        this.idleAction.setEffectiveTimeScale(1).setEffectiveWeight(1);
        this.runAction.crossFadeTo(this.idleAction, crossFadeDuration);
    } else if (newState === this.STATES.RUN) {
        // 从静止到运动的平滑过渡
        const crossFadeDuration = 0.5; // 过渡时间
        this.runAction.reset().play();
        this.runAction.setEffectiveTimeScale(1).setEffectiveWeight(1);
        this.idleAction.crossFadeTo(this.runAction, crossFadeDuration);
    }

    this.currentState = newState;
}

}
