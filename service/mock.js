const fs = require('fs');
const path = require('path');
const Mock = require('mockjs');

// http://mockjs.com/examples.html#String
const template = {
    "id": "@id",
    "typeCourseCategoryId": "@id",
    "tagCourseCategoryId": "@id",
    "name": "@cword(5, 20)",
    "secondName": "@cword(5, 20)",
    "coverImgUrl1": "",
    "flag": false
};


// 生成数据的函数
function generateData(filePath, count) {
    const data = {
        list: []
    };
    for (let i = 0; i < count; i++) {
        data.list.push(Mock.mock(template));
    }

    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // 将数据写入文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data written to ${filePath}`);
}

// 示例调用
generateData("data/course-recommend.json", 4);
// 生成数据