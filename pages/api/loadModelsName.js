// pages/api/loadModelsName.js
import fs from "fs";
import path from "path";

export default (req, res) => {
  const directoryPath = path.join(
    process.cwd(),
    "public/KitchenBattle/models/foods"
  ); // 获取绝对路径
  console.log(directoryPath);
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).json({ error: "无法读取目录" });
    } else {
      res.status(200).json({ files });
    }
  });
};
