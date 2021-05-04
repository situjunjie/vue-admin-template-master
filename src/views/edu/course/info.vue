<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.firstSubjectId"
          placeholder="请选择"
          @change="changeFirstSubject"
        >
          <el-option
            v-for="subject in firstSubjectList"
            :key="subject.id"
            :label="subject.label"
            :value="subject.id"
          />
        </el-select>
        <!--二级分类-->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in secondSubjectList"
            :key="subject.id"
            :label="subject.label"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介  -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduservice/oss/uploadImg'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/course.js";
import subject from "@/api/subject.js";
import Tinymce from "@/components/Tinymce";

const defaultForm = {
  title: "",
  lessonNum: "",
  price: "",
  description: "",
  teacherId: "",
  subjectId: "",
  cover: "https://edu-teacher0501.oss-cn-hangzhou.aliyuncs.com/beita.png",
  firstSubjectId:''
};
export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      courseInfo: defaultForm,
      saveBtnDisabled: false, //保存按钮默认可用
      teacherList: [], //讲师选择下拉列表
      firstSubjectList: [],
      secondSubjectList: [],
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },
  created() {
    //页面加载先加载讲师下拉列表
    this.init();
  },
  methods: {
    next() {
      //需要判断是编辑课程还是新增课程
      //this.$router.push({path:'/course/chapter/1'})
      if (this.$route.params && this.$route.params.id) {
        this.courseInfo.id = this.$route.params.id;
        this.updateCourseInfo();
      } else {
        this.addCourseInfo();
      }
    },

    addCourseInfo() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          type: "success",
          message: "课程基本信息保存成功",
        });
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },
    updateCourseInfo() {
      //保存课程信息
      course.updateCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          type: "success",
          message: "课程基本信息保存成功",
        });
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },

    init() {
      //初始化
      console.log("初始化");
      if (this.$route.params && this.$route.params.id) { //如果是编辑页面回退
        const id = this.$route.params.id;
        course.getCourseInfoById(id).then((response) => {
          this.courseInfo = response.data.form;
        subject.getAllSubjectTree()
          .then(response=>{
            this.firstSubjectList = response.data.subjects
            for(var i = 0;i<response.data.subjects.length;i++){
              var oneLevel = response.data.subjects[i]
              if(this.courseInfo.firstSubjectId===oneLevel.id){
                this.secondSubjectList = oneLevel.children
                break
              }
            }
          })
        });
      } else {//否则表单默认为空
        this.courseInfo = { ...defaultForm };
      }
          course.getAllTeacherList().then((response) => {
            console.log('获取教师列表');
            this.teacherList = response.data.items;  
          });
            this.getFirstLevelSubjectList()
          
    },

    //获取分类列表
    getFirstLevelSubjectList() {
      subject.getAllSubjectTree().then((response) => {
        this.firstSubjectList = response.data.subjects;
      });
    },

    //点击一级课程分类联动二级菜单
    changeFirstSubject(value) {
      for (var i = 0; i < this.firstSubjectList.length; i++) {
        if (value === this.firstSubjectList[i].id) {
          this.secondSubjectList = this.firstSubjectList[i].children;
        }
      }
      this.courseInfo.subjectId = "";
    },

    handleAvatarSuccess(res, file) {
      //封面上传成功方法
      this.courseInfo.cover = res.data.imgurl;
    },
    beforeAvatarUpload(file) {
      //封面上传前方法
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG|isPNG)) {
        this.$message.error("上传封面只能是 图片 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return (isJPG|isPNG) && isLt2M;
    },
  },

  watch: {
    $route(to, from) {
      this.init();
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>