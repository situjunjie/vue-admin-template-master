<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">
        
        <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>

  <!-- 所属分类 TODO -->

 <!-- 课程讲师 -->
<el-form-item label="课程讲师">
  <el-select
    v-model="courseInfo.teacherId"
    placeholder="请选择">
    <el-option
      v-for="teacher in teacherList"
      :key="teacher.id"
      :label="teacher.name"
      :value="teacher.id"/>
  </el-select>
</el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>

  <!-- 课程简介  -->
    <el-form-item label="课程简介">
    <el-input v-model="courseInfo.description" placeholder=" 示例：课程简介"/>
  </el-form-item>
  <!-- 课程封面 TODO -->

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>

  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
  </el-form-item>


    </el-form>
  </div>
</template>

<script>
import course from '@/api/course.js'
const defaultForm = {
                title:'',
                lessonNum:'',
                price:'',
                description:'',
                teacherId:''
            }
export default {
    data(){
        return {
            courseInfo:defaultForm,
            saveBtnDisabled:false , //保存按钮默认可用
            teacherList:[] //讲师选择下拉列表
        }
    },
    created () {
        //页面加载先加载讲师下拉列表
        course.getAllTeacherList()
        .then(response=>{
          this.teacherList = response.data.items
        })
    },
    methods: {
        next(){
            //需要判断是编辑课程还是新增课程
            //this.$router.push({path:'/course/chapter/1'})
            if(this.$route.params && this.$route.params.id){
              this.updateCourseInfo()
            }else{
              this.addCourseInfo()
            }
        },

        addCourseInfo(){
          course.addCourseInfo(this.courseInfo)
            .then(response=>{
              this.$message({
                    type: 'success',
                    message: '课程基本信息保存成功'
                })
              this.$router.push({path:'/course/chapter/'+response.data.courseId})
            })
        },
        updateCourseInfo(){

          //保存课程信息 TODO
        },

        init(){
          //初始化 TODO
          this.getCourseFormById()
        }
        ,
        getCourseFormById(){
          //获取表单信息 TODO
        }


    }
}
</script>