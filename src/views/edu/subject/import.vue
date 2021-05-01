<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">点击右侧按钮可以下在模板文件</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="'/static/subject-template.xls'">点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/edu-subject/uploadXls'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false,
    };
  },
  created() {},
  methods: {
    //上传到服务器按钮点击
    submitUpload() {
      this.fileUploadBtnText = "正在上传";
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();
    },
    //文件上传成功回调
    fileUploadSuccess(response) {
      if (response.success === true) {
        this.fileUploadBtnText = "导入成功";
        this.loading = false;
        this.$message({
          type: "success",
          message: response.message,
        });
      } else {
        this.fileUploadBtnText = "导入失败";
        this.loading = false;
        const messages = response.data.messageList;
        let msgString = "<ul>";
        messages.forEach((msg) => {
          msgString += `<li>${msg}</li>`;
        });
        msgString += "</ul>";
        this.$alert(msgString, response.message, {
          dangerouslyUseHTMLString: true,
        });
      }
    },
    //文件上传失败回调
    fileUploadError() {
      this.fileUploadBtnText = "导入失败";
      this.loading = false;
      this.$message({
        type: "error",
        message: "导入失败",
      });
    },
  },
};
</script>