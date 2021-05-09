<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
<el-button type="text" @click="addChapterBtn">添加章节</el-button>
<!-- 章节 -->
<!-- 添加和修改章节表单 -->
<el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
    <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
</el-dialog>

<!-- 添加和修改小节表单 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
    <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
            <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
            <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
    </div>
</el-dialog>

<ul class="chanpterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button type="text" @click="openSaveVideoForm(chapter.id)">添加小节</el-button>
                <el-button  type="text" @click="updateChapterById(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapterById(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="openUpdateVideoForm(video.id)" >编辑</el-button>
                        <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                    </span>
                </p>
            </li>
        </ul>
    </li>
</ul>

    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/chapter.js'
import video from '@/api/video.js'
export default {
  
  data() {
    return {
      id:'',
      saveBtnDisabled: false ,// 保存按钮是否禁用
      chapterVideoList:[],
      chapter:{
        id:'',
        courseId:'',
        title:'',
        sort:''
      },
      video:{
        id:'',
        courseId:'',
        chapterId:'',
        title:'',
        sort:''
      },
      dialogChapterFormVisible:false,
      dialogVideoFormVisible:false
    }
  },

  created() {
    console.log('chapter created')
    this.init()
    this.getChapterVideoList(this.id)
  },

  methods: {
    previous() {
      console.log('previous')
      
      this.$router.push({ path: '/course/info/'+this.$route.params.id })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/'+this.$route.params.id })
    },
    init(){
      if(this.$route.params&&this.$route.params.id){
        this.id = this.$route.params.id
        this.chapter.courseId = this.id
        this.video.courseId = this.id
        console.log("this.chapter.courseId = "+this.chapter.courseId)
      }
    },
    getChapterVideoList(id){
      chapter.getChapterVideoList(id)
      .then(response=>{
        this.chapterVideoList = response.data.items
      })
    },

    updateChapterById(id){
      
      for(var i =0;i<this.chapterVideoList.length;i++){
        if(id == this.chapterVideoList[i].id){
          this.chapter = this.chapterVideoList[i]
          break
        }
      }
      this.dialogChapterFormVisible = true
    },

    //弹出框的保存按钮
    saveOrUpdate(){
      if(this.chapter.id){
        console.log("修改");
        this.updateChapter()
      }else{
        console.log("新增");
        this.saveChapter()
      }
    },

    updateChapter(){
      chapter.updateChapter(this.chapter)
      .then(response=>{
        this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
        this.dialogChapterFormVisible = false
        this.getChapterVideoList(this.id)
      }).catch(response=>{
        this.$message({
                        type: 'error',
                        message: '修改失败'
                    })
      })
    },
    saveChapter(){
      chapter.addChapter(this.chapter)
      .then(response=>{
        this.$message({
                    type: 'success',
                    message: '添加成功!'
                })
        this.dialogChapterFormVisible = false
        this.getChapterVideoList(this.id)

      }).catch(response=>{
        this.$message({
                        type: 'error',
                        message: '添加失败'
                    })
      })
    },

    deleteChapterById(id){
      this.$confirm('此操作将删除该章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
              return chapter.deleteChapterById(id)
            }).then(()=>{
              this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.getChapterVideoList(this.id)
            }).catch(()=>{
              this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
            })
    },
    addChapterBtn()
    {
        this.dialogChapterFormVisible = true
      
        this.chapter.title=''
        this.chapter.sort=''
        this.chapter.id=''
    },

    openSaveVideoForm(chapterId){
      this.video.title=''
      this.video.sort=0
      this.dialogVideoFormVisible = true
      this.video.chapterId = chapterId
      
    },
    openUpdateVideoForm(videoId){
      video.getVideo(videoId).then(response=>{
        this.video = response.data.item
        this.dialogVideoFormVisible = true
        this.video.chapterId = chapterId
      }).catch(response=>{

      })
      
    },

    saveOrUpdateVideo(){
      //判断新增还是修改
      if(this.video.id){
        this.updateVideo()
      }else{
      this.saveVideo()
      }
    },
    saveVideo(){
      video.addVideo(this.video)
      .then(()=>{
        this.$message({
                    type: 'success',
                    message: '新增成功!'
                })
        this.dialogVideoFormVisible=false
        this.getChapterVideoList(this.id)
      }).catch(()=>{
      this.$message({
                        type: 'error',
                        message: '新增失败'
                    })
      })
    },
    updateVideo(){
      video.updateVideo(this.video)
      .then(()=>{
        this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
        this.dialogVideoFormVisible=false
        this.getChapterVideoList(this.id)
        this.video.id=''
      })
      .catch(()=>{
        this.$message({
                        type: 'error',
                        message: '修改失败'
                    })
                    this.video.id=''
      })
    },

    deleteVideo(videoid){
      this.$confirm('此操作将删除该小节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
              console.log("点击确定删除");
              return video.deleteVideoById(videoid)
            }).then(()=>{
              this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.getChapterVideoList(this.id)
            }).catch(()=>{
              this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
            })
    }


  }
}
</script>