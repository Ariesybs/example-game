import { Game } from "./game";
import { useEffect } from "react";
export default function main() {
  let game;
  useEffect(() => {
    // 加入判断，防止重复创建
    if (!game) {
      game = new Game();
    }

    // 创建link元素
    const iconLink = document.createElement('link');

    // 设置link元素的属性
    iconLink.rel = 'icon';
    iconLink.type = 'image/png'; // 图标的文件类型
    iconLink.href = '/favicon.ico'; // 图标文件的路径

    // 将link元素添加到head中
    document.head.appendChild(iconLink)
    
    
  }, []);
  return <div id="container" />;
}
