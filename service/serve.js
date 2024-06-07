
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


app.get("/api/v1/student/document/img-preview", (req, res) => {
  const filePath = path.join(
    __dirname,
    "data",
    "api-v1-student-document-img-preview.json"
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

app.post("/api/v1/student/document/info", (req, res) => {
  const filePath = path.join(
    __dirname,
    "data",
    "api-v1-student-document-info.json"
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

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
