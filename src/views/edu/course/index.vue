<template>
    <div class="app-container">课程列表

 <!--查询表单-->
    <!--查询表单-->
<el-form :inline="true" class="demo-form-inline">

  <!-- 所属分类：级联下拉列表 -->
  <!-- 一级分类 -->
  <el-form-item label="课程类别">
    <el-select
      v-model="searchObj.firstSubjectId"
      placeholder="请选择"
      @change="subjectLevelOneChanged">
      <el-option
        v-for="subject in subjectNestedList"
        :key="subject.id"
        :label="subject.label"
        :value="subject.id"/>
    </el-select>

    <!-- 二级分类 -->
    <el-select v-model="searchObj.subjectId" placeholder="请选择">
      <el-option
        v-for="subject in subSubjectList"
        :key="subject.id"
        :label="subject.label"
        :value="subject.id"/>
    </el-select>
  </el-form-item>

  <!-- 标题 -->
  <el-form-item>
    <el-input v-model="searchObj.title" placeholder="课程标题"/>
  </el-form-item>
  <!-- 讲师 -->
  <el-form-item>
    <el-select
      v-model="searchObj.teacherId"
      placeholder="请选择讲师">
      <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
  </el-form-item>

  <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
  <el-button type="default" @click="resetData()">清空</el-button>
</el-form>

<!-- 表格 -->
<el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <!-- <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column> -->

 <el-table-column
    label="序号"
    width="70"
    align="center">
    <template slot-scope="scope">
      {{ (page - 1) * limit + scope.$index + 1 }}
    </template>
  </el-table-column>

      <el-table-column prop="title" label="名称" width="350" />
      <el-table-column label="价格" width="100" align="center" >
    <template slot-scope="scope">
      {{ Number(scope.row.price) === 0 ? '免费' :
      '¥' + scope.row.price.toFixed(2) }}
    </template>
  </el-table-column>
  <el-table-column label="创建时间" align="center">
    <template slot-scope="scope">
      {{ scope.row.gmtCreate.substr(0, 10) }}
    </template>
  </el-table-column>
  <el-table-column label="发布时间" align="center">
    <template slot-scope="scope">
      {{ scope.row.gmtModified.substr(0, 10) }}
    </template>
  </el-table-column>

  <el-table-column label="操作" width="150" align="center">
    <template slot-scope="scope">
      <router-link :to="'/edu/course/info/'+scope.row.id">
        <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
      </router-link>
      <router-link :to="'/edu/course/chapter/'+scope.row.id">
        <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
      </router-link>
      <el-button type="text" size="mini" icon="el-icon-delete" @click="removeCourseById(scope.row.id)">删除</el-button>
    </template>
  </el-table-column>
</el-table>

<!-- 分页 -->
<el-pagination
  :current-page="page"
  :page-size="limit"
  :total="total"
  style="padding: 30px 0; text-align: center;"
  layout="total, prev, pager, next, jumper"
  @current-change="fetchData"
/>
        
    </div>
    
</template>

<script>
import subject from '@/api/subject'
import course from '@/api/course'
const defaultSearchObject = {
            teacherId:'',
            title:'',
            subjectId:'',
            firstSubjectId:''
        }
export default{

    

    data(){
        return {
        listLoading:true,
        searchObj:defaultSearchObject,
        subjectNestedList:[],
        subSubjectList:[],
        teacherList:[],
        page:1,
        limit:5,
        total:0,
        list:null
        }
    },
    created(){
        this.getAllSubjectList()
        this.getTeacherList()
        this.fetchData(1);
    },
    methods:{
        getAllSubjectList(){
            subject.getAllSubjectTree()
            .then(response=>{
               this.subjectNestedList = response.data.subjects
            })
        },
        subjectLevelOneChanged(){
            const firstSubjectId = this.searchObj.firstSubjectId
            for(var i =0 ;i < this.subjectNestedList.length;i++){
                if(firstSubjectId===this.subjectNestedList[i].id){
                    this.subSubjectList = this.subjectNestedList[i].children
                    break
                }
            }
        },
        getTeacherList(){
            course.getAllTeacherList().then(response=>{
                this.teacherList = response.data.items
            })
        },

        fetchData(page=1){
            course.queryCourseList(page,this.limit,this.searchObj).then(response=>{
                console.log(response);
                this.list = response.data.items.records
                this.total =response.data.items.total
                
                console.log('total==='+this.total);
                console.log('list==='+this.list);
                this.listLoading=false
            })
        },
        resetData(){
            this.searchObj = {}
            this.fetchData(1)
        },
        removeCourseById(id){
            this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //调用方法进行删除
                //return 表示后面then还会执行
                //return teacher.deleteTeacherById(id)
                return course.deleteCourseById(id)
            }).then(() => {
                //刷新整个页面
                this.resetData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            }).catch((response) => {
                //判断点击取消，还是删除失败
                if (response === 'cancel') {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                }        
            })
            
        }

    }
}

</script>
