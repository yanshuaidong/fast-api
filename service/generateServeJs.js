const fs = require("fs");
const path = require("path");

function generateServeJs() {
  // 读取 api.json 文件
  const apiFilePath = path.join(__dirname, "data", "api.json");
  const apiData = JSON.parse(fs.readFileSync(apiFilePath, "utf-8"));

  // 生成 serve.js 文件内容
  let serveJsContent = `
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const Mock = require("mockjs");
const app = express();
const port = 3000; // 你可以选择任何未被占用的端口
app.use(cors());
app.use(bodyParser.json());

`;

  // 动态生成路由
  apiData.apis.forEach((api) => {
    const method = api.method.toLowerCase();
    const route = `
app.${method}("${api.apiPath}", (req, res) => {
  const filePath = path.join(
    __dirname,
    "data",
    "${api.resFile}"
  );
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});
`;
    serveJsContent += route;
  });

  // 添加启动服务器代码
  serveJsContent += `
// 启动服务器
app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
`;

  // 将生成的内容写入 serve.js 文件
  const serveJsFilePath = path.join(__dirname, "serve.js");
  fs.writeFileSync(serveJsFilePath, serveJsContent, "utf-8");
}

module.exports = generateServeJs;
