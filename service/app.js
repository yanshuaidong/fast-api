const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const Mock = require("mockjs");
const port = 3001;
const generateServeJs = require("./generateServeJs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let serveProcess = null;

// 启动 serve.js
app.get("/run", (req, res) => {
  if (serveProcess) {
    return res.status(400).send("serve.js is already running.");
  }

  serveProcess = exec("node serve.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });

  res.send("serve.js started.");
});

// 停止 serve.js
app.get("/stop", (req, res) => {
  if (!serveProcess) {
    return res.status(400).send("serve.js is not running.");
  }
  serveProcess.kill();
  serveProcess = null;
  res.send("serve.js stopped.");
});

// 创建 serve.js
app.get("/create", (req, res) => {
  try {
    generateServeJs();
    res.send("serve.js 文件已生成");
  } catch (error) {
    res.status(500).send("Error generating serve.js file");
  }
});

// 获得 API 列表
app.get("/api-list", (req, res) => {
  // 读取数据文件
  const filePath = path.join(__dirname, "data", "api.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }
    res.json(JSON.parse(data).apis);
  });
});

// 获得一个 API 的详情
app.get("/get-api", (req, res) => {
  // 读取数据文件
  const filePath = path.join(__dirname, "data", "api.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }

    const resData = {};
    const jsonData = JSON.parse(data);

    jsonData.apis.forEach((api) => {
      if (api.apiPath === req.query.apiPath) {
        resData.name = api.name;
        resData.method = api.method;
        resData.apiPath = api.apiPath;
        resData.resFile = api.resFile;
        resData.resJson = JSON.parse(
          fs.readFileSync(path.join(__dirname, "data", api.resFile), "utf-8")
        );
      }
    });

    res.json(resData);
  });
});

// 添加一个 API
app.post("/set-api", (req, res) => {
  // 解析请求体中的参数
  const { name, method, apiPath, resJson } = req.body;

  // 读取数据文件
  const filePath = path.join(__dirname, "data", "api.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }

    // 解析数据文件内容
    const jsonData = JSON.parse(data);
    let apiExists = false;

    jsonData.apis.forEach((api) => {
      if (api.apiPath === apiPath) {
        // 更改现有 API
        api.name = name;
        api.method = method;
        api.resFile = `${apiPath.replace(/\//g, "-")}.json`;
        apiExists = true;
      }
    });

    if (!apiExists) {
      // 添加新的 API
      const newApi = {
        name,
        method,
        apiPath,
        resFile: `${apiPath.replace(/\//g, "-")}.json`,
      };
      apiList.push(newApi);
    }
    //  使用 writeFileSync 将 jsonData 写入filePath数据文件
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
    // 使用 writeFileSync 将 resJson 写入resFilePath数据文件
    const resFilePath = path.join(
      __dirname,
      "data",
      `${apiPath.replace(/\//g, "-")}.json`
    );
    fs.writeFileSync(resFilePath, JSON.stringify(resJson, null, 2), "utf-8");
    res.json(1);
  });
});

// 启动 guard.js 服务器
app.listen(port, () => {
  console.log(`Guard server running on http://localhost:${port}`);
});
