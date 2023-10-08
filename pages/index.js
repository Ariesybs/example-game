import { Game } from "./game";
import { useEffect } from "react";
export default function main() {
  let game;
  useEffect(() => {
    // 加入判断，防止重复创建
    if (!game) {
      game = new Game();
    }
    
    
  }, []);
  return <div id="container" />;
}
