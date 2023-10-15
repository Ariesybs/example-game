import { Game } from "./game";
import { useEffect } from "react";
export default function main() {
  let game;
  useEffect(() => {
    if (!game) {
      game = new Game();
    }
  }, []);

  return <div id="container"></div>;
}
