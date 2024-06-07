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

// 定义一个路由来返回 "Hello World"
app.get("/hello", (req, res) => {
  res.send("Hello World");
});

// 异步读取 JSON 文件
// http://localhost:3000/synchronous-teaching/catalog?stageId=4&subjectId=1&textbookId=4664&_t=1717222794718
app.get("/synchronous-teaching/catalog", (req, res) => {
  // 解析查询参数
  const queryParams = req.query;
  const stageId = queryParams.stageId;
  const subjectId = queryParams.subjectId;
  const textbookId = queryParams.textbookId;

  // 读取 JSON 文件
  fs.readFile("data/catalog.json", "utf8", (err, fileContents) => {
    if (err) {
      // 如果读取文件发生错误，返回错误信息
      console.error(err);
      return res.status(500).send("Error reading the file");
    }

    // 解析 JSON 数据
    const data = JSON.parse(fileContents);

    // 发送响应
    res.json(data);
  });
});

// http://localhost:3000/train/v1/synchronous-teaching/course-recommend?stageId=4&subjectId=6
app.get("/train/v1/synchronous-teaching/course-recommend", (req, res) => {
  // 解析查询参数
  const queryParams = req.query;
  const stageId = queryParams.stageId;
  const subjectId = queryParams.subjectId;

  // 读取数据文件
  const filePath = path.join(__dirname, "data", "course-recommend.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }
    // 解析数据文件内容
    const jsonData = JSON.parse(data);
    // 返回分页数据
    res.json(jsonData);
  });

  // --------------------------------------------前端使用
  // const response = await fetch(
  //     'http://localhost:3000/train/v1/synchronous-teaching/course-recommend?stageId=4&subjectId=6'
  //   );
  // const data = await response.json();
  // return data.list;
});

// http://localhost:3000/train/v1/synchronous-teaching/video-chapter
// POST接口，用于接收视频章节信息
app.post("/train/v1/synchronous-teaching/video-chapter", (req, res) => {
  // 解析请求体中的参数
  // 解析请求体中的参数
  const { catalogId, textbookId, formsIds, pageNum, pageSize } = req.body;

  // 读取数据文件
  const filePath = path.join(__dirname, "data", "video-chapter.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }

    // 解析数据文件内容
    const jsonData = JSON.parse(data);
    const total = jsonData.list.length;

    // 计算分页数据
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const paginatedList = jsonData.list.slice(startIndex, endIndex);
    // 返回分页数据
    res.json({
      courseForms: [
        {
          id: 0,
          name: "全部",
          count: "32",
        },
        {
          id: 6313,
          name: "讲座/圆桌",
          count: "0",
        },
        {
          id: 6314,
          name: "指导课",
          count: "13",
        },
        {
          id: 6315,
          name: "示范课",
          count: "0",
        },
        {
          id: 6316,
          name: "课堂实录",
          count: "0",
        },
        {
          id: 9,
          name: "直播",
          count: "14",
        },
      ],
      pageNum: pageNum,
      pageSize: pageSize,
      total: total.toString(),
      list: paginatedList,
    });
  });

  // const postData = {
  //     catalogId,
  //     textbookId,
  //     formsIds,
  //     pageNum,
  //     pageSize: this.pageParams?.pageSize || 30,
  //   };
  //   const response = await fetch('http://localhost:3000/train/v1/synchronous-teaching/video-chapter', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(postData),
  //   });

  //   const data = await response.json();
  //   return data;
});

// https://test-yx.xkw.com/train/v1/user-member/info?_t=1717236795180
// http://localhost:3000/train/v1/user-member/info
app.get("/train/v1/user-member/info", (req, res) => {
  // 读取数据文件
  const filePath = path.join(__dirname, "data", "user-member-info.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }
    // 解析数据文件内容
    const jsonData = JSON.parse(data);
    // 返回分页数据
    res.json(jsonData);
  });

  // --------------------------------------------前端使用
  // const response = await fetch(
  //     'http://localhost:3000/train/v1/synchronous-teaching/course-recommend?stageId=4&subjectId=6'
  //   );
  // const data = await response.json();
  // return data.list;
});

// https://local.xkw.com:8086/api/v1/student/user/info
// http://localhost:3000/api/v1/student/user/info
app.get("/api/v1/student/user/info", (req, res) => {
  // 读取数据文件
  const filePath = path.join(__dirname, "data", "student-user-info.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }
    // 解析数据文件内容
    const jsonData = JSON.parse(data);
    // 返回分页数据
    res.json(jsonData);
  });

  // --------------------------------------------前端使用
  // const response = await fetch(
  //     'http://localhost:3000/api/v1/student/user/info'
  //   );
  // const data = await response.json();
  // return data.list;
});

// https://local.xkw.com:8086/api/v1/student/document/info/35687437
// http://localhost:3000/api/v1/student/document/info/35687437
app.get("/api/v1/student/document/info", (req, res) => {
  // 读取数据文件
  const filePath = path.join(__dirname, "data", "document-info.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data file" });
    }
    // 解析数据文件内容
    const jsonData = JSON.parse(data);
    // 返回分页数据
    res.json(jsonData);
  });

  // --------------------------------------------前端使用
  // const response = await fetch(
  //     'http://localhost:3000/api/v1/student/document/info/35687437'
  //   );
  // const data = await response.json();
  // return data.list;
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
