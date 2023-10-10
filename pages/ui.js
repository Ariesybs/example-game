import { ChatBox } from "./chatBox";
export class UI {
  constructor(parentElement) {
    this.parentElement = document.getElementById(parentElement);
    this.chatBox = new ChatBox(this.parentElement);
    this.chatBox.addMessage("hello");
    this.chatBox.addMessage("world");
    //this.cursor = new Cursor()
  }
}
