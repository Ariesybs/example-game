class StateMachine {
  constructor() {
    this.states = {}; // 存储状态
    this.currentState = null; // 当前状态
  }

  // 添加状态
  addState(name, state) {
    this.states[name] = state;
  }

  // 切换到新状态
  setState(name) {
    if (this.currentState) {
      this.currentState.exit(); // 退出当前状态
    }

    this.currentState = this.states[name];
    this.currentState.enter(); // 进入新状态
  }
}
