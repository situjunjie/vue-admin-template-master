
<template>
  <div class="app-container">
    <el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
<el-tree
  class="filter-tree"
  :data="data"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="tree">
  <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() =>{dialogFormVisible = true;subject.parentId=data.id}">添加二级分类</el-button>
          <el-button
            
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
</el-tree>

<!-- 弹出添加分类模态框 -->
<el-dialog :visible.sync="dialogFormVisible" title="添加分类">
    <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
            <el-input v-model="subject.title"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject">确 定</el-button>
    </div>
</el-dialog>
  </div>
  
</template>


<script>
import subject from '@/api/subject.js'
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      initTree(){
        subject.getAllSubjectTree().then(response=>{
            this.data = response.data.subjects
        })
      },

      remove(node,data){
          //subject.deleteSubjectBtId(data.id)
        this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //调用方法进行删除
                //return 表示后面then还会执行
                //return teacher.deleteTeacherById(id)
                return subject.deleteSubjectBtId(data.id)
            }).then(() => {
                //刷新整个页面
                this.$refs.tree.remove(node)
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
          
      },
      //点击保存课程按钮
    addSubject(){
        //1.先判断保存的是一级还是二级分类
        if(this.subject.parentId){
            console.log("二级分类");
            subject.addSecondSubject(this.subject)
            .then(()=>{
                this.$message({
                    type: 'success',
                    message: '新增成功!'
                })
                //重新刷新
                this.initTree()
                this.dialogFormVisible=false
                this.subject.title=''
                this.subject.parentId=''
            })

        }else{
            console.log("一级分类");
            subject.addFirstSubject(this.subject)
            .then(()=>{
                this.$message({
                    type: 'success',
                    message: '新增成功!'
                })
                //重新刷新
                this.initTree()
                this.dialogFormVisible=false
                this.subject.title=''
                this.subject.parentId=''
            })
        }
    }
    },

    

    created () {
        this.initTree();
    },

    data() {
      return {
        filterText: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        subject:{
            title:'',
            parentId:''
        },
        dialogFormVisible:false,
      };
    }
  };
</script>