const fs = require('fs');
const path = require('path');
const Mock = require('mockjs');

// http://mockjs.com/examples.html#String
// 定义数据模板
// const template = {
//     "id": "@id",
//     "courseId": "@id",
//     "name": "@cword(5, 8)",
//     "duration": "@integer(100, 600)",
//     "coverImg": "https://oss-jiaopei-public.oss-cn-hangzhou.aliyuncs.com/test/img/20230907/1182637419368521728.png",
//     "lecturerName": [
//         "药老",
//         "美杜莎"
//     ],
//     "learnStatus": 0,
//     "outputList": [
//         {
//             "key": "标清",
//             "value": "S00000002-100030"
//         },
//         {
//             "key": "高清",
//             "value": "S00000002-100040"
//         },
//         {
//             "key": "超清",
//             "value": "S00000002-100050"
//         }
//     ]
// };
const template = {
    "id": "@id",
    "typeCourseCategoryId": "@id",
    "tagCourseCategoryId": "@id",
    "name": "@cword(5, 20)",
    "secondName": "@cword(5, 20)",
    "coverImgUrl1": "https://img-yx.xkw.com/test/img/20230714/1162804412587520000.jpg",
    "payType": 3,
    "price": 200.00,
    "chapterCount": 2,
    "videoCount": 2,
    "documentCount": 3,
    "learnCount": 65,
    "basicSellNum": 1,
    "lecturerList": [
        {
            "id": "1144216806551531520",
            "name": "@cword(5, 8)",
            "faceImgUrl": "https://img-yx.xkw.com/test/img/20230524/1144216704441200640.png",
            "introduce": "赵赵赵",
            "detail": "<p><sub>北京某重点中学语文老师，北京市教师作家协会成员，在新浪、北京青年报、新加坡联合早报等国内外主流媒体上发表多篇文章。对新教材新高考有深入研究和思考，尤擅长阅读和写作专题。</sub></p>"
        }
    ],
    "selected": 0,
    "buyStatus": 2,
    "isLimitFree": 0,
    "limitStartTime": "1696953600000",
    "limitEndTime": "1698335999000",
    "downloadableFileCount": 3,
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