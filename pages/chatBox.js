export class ChatBox {
  constructor(parentElement) {
    // 创建聊天框容器
    this.isShow = false
    this.container = document.createElement('div');
    this.container.id = 'chat-box';
    this.container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 10px;
      background-color: rgba(34, 34, 34, 0.6);
      padding-right: 10px;
      padding-left: 10px;
      width: 500px;
      height: 400px;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      transition: height 0.3s ease; /* 添加过渡动画 */
    `;

    // 创建关闭按钮
    this.closeButton = document.createElement('div');
    this.closeButton.textContent = 'X'; // 使用 "X" 符号表示关闭
    this.closeButton.style.cssText = `
      align-self: flex-end;
      cursor: pointer;
      padding-top: 10px;
      color: white;
      font-weight: bold; 
    `;
    this.closeButton.addEventListener('click', () => {
      this.hideChatBox();
    });
    this.container.appendChild(this.closeButton);

    // 创建消息面板容器
    this.messagePanel = document.createElement('div');
    this.messagePanel.style.cssText = `
      flex: 1;
      margin-bottom: 10px; /* 添加间距 */
      color: white;
    `;
    this.container.appendChild(this.messagePanel);

    // 创建输入面板容器
    this.inputPanel = document.createElement('div');
    this.inputPanel.style.cssText = `
      display: flex;
      align-items: center;
    `;

    // 创建输入框
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.placeholder = '请输入聊天内容...';
    this.inputField.style.flex = '1'; // 让输入框占据剩余空间
    this.inputPanel.appendChild(this.inputField);

    // 创建发送按钮
    this.sendButton = document.createElement('button');
    this.sendButton.textContent = '发送';
    this.inputPanel.appendChild(this.sendButton);

    
    // 添加事件监听器，点击按钮时触发addMessage函数
    this.sendButton.addEventListener('click', () => {
      const message = this.inputField.value;
      if (message) {
        this.addMessage(message);
        //this.inputField.value = ''; // 清空输入框
      }
    });
    // 当按下回车键时显示 chatBox
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if(document.activeElement === this.inputField){
                this.addMessage(this.inputField.value)
            }else{
                this.showChatBox();
            }
            
        }
    })

    this.hideChatBox()

    this.container.appendChild(this.inputPanel);

    // 将聊天框添加到父容器
    parentElement.appendChild(this.container);
  }

  // 显示 chatBox
  showChatBox() {
    this.container.style.height = '400px'; // 设置合适的高度
    this.inputField.focus()
  }

  // 隐藏 chatBox
  hideChatBox() {
    this.container.style.height = '0'; // 隐藏 chatBox
  }

  // 添加消息到消息面板
  addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent ="player:  "+ message;
    messageElement.style.wordWrap = 'break-word'; // 当文字过长时换行
    //messageElement.style.color = "white"
    this.messagePanel.appendChild(messageElement);
    if(this.messagePanel.scrollTop){
        this.messagePanel.scrollTop = this.messagePanel.scrollHeight;
    }
  }
}

