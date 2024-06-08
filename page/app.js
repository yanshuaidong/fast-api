// 初始化 Vue 实例
new Vue({
  el: "#app",
  data() {
    return {
      apiList: [], // API 列表
      selectedApi: {}, // 选中的 API
      inputContent: "", // 输入框内容
      dialogVisible: false, // 弹窗
      newApi: {
        name: "", //
        method : "", //
        apiPath : "", //
        resJson : {}, //
      },
    };
  },
  async mounted() {
    this.apiList = await this.getApiList();
    const firstApi = this.apiList[0];
    this.selectedApi = await this.getApiData(firstApi.apiPath);
    console.log("selectedApi", this.selectedApi);
    window.initEditorContent = this.initEditorContent;
  },
  methods: {
    async getApiList() {
      const response = await fetch("http://localhost:3001/api-list");
      const data = await response.json();
      return data;
    },
    async getApiData(apiPath) {
      apiPath = encodeURIComponent(apiPath);
      const response = await fetch(
        `http://localhost:3001/get-api/?apiPath=${apiPath}`
      );
      const data = await response.json();
      data.reqJson = this.generateFetchMethodString(data);
      return data;
    },
    async setApiData(param) {
      const response = await fetch('http://localhost:3001/set-api', {
        method: 'POST',
        body: JSON.stringify(param),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    },
    //
    async updateApi() {
      const response = await this.setApiData(this.selectedApi);
      console.log('const response', response.json());
      this.$message({
        message: "完成更新",
        type: "success",
      });
    },
    async addApi(){
      // newApi
      const response = await this.setApiData(this.newApi);
      console.log('const response', response.json());
      dialogVisible = false;
      this.$message({
        message: "完成添加",
        type: "success",
      });
    },
    //初始化编辑器
    initEditorContent() {
      try {
        window.resEditor.setValue(JSON.stringify(this.selectedApi.resJson));
        window.reqEditor.setValue(this.selectedApi.reqJson);
        window.resEditor.getAction("editor.action.formatDocument").run();
        window.reqEditor.getAction("editor.action.formatDocument").run();
        console.log("初始化编辑器");
      } catch (error) {
        console.log(error);
      }
    },
    // 切换选项
    async handleSelect(index) {
      const selectItem = this.apiList[index];
      this.selectedApi = await this.getApiData(selectItem.apiPath);
      this.initEditorContent();
      console.log("切换选项");
    },
    // 格式化代码
    formatCode() {
      console.log("格式化代码");
      window.resEditor.getAction("editor.action.formatDocument").run();
    },
    // 复制
    copyCode() {
      console.log("复制代码");
      // 获取编辑器中的代码
      const newCode = resEditor.getValue();
      // 创建一个临时的textarea元素来复制代码
      const textarea = document.createElement("textarea");
      textarea.value = newCode;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        // 执行复制命令
        document.execCommand("copy");
        // 显示成功消息
        this.$message({
          message: "恭喜你，代码已成功复制",
          type: "success",
        });
      } catch (err) {
        // 如果复制失败，显示错误消息
        this.$message({
          message: "复制失败，请重试",
          type: "error",
        });
      }
      // 移除临时的textarea元素
      document.body.removeChild(textarea);
    },
    generateFetchMethodString(apiDetails) {
      const { name, method, apiPath } = apiDetails;
      return `const response = await fetch('http://localhost:3000${apiPath}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log('${name} response:', data);
  `;
    },
  },
});
