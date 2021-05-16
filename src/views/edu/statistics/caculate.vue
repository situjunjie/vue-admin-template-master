<template>
<div>
<el-form ref="form" :model="form" label-width="80px" :inline="true" >
  
  <el-form-item label="计算日期">
      <el-date-picker type="date" placeholder="选择日期" v-model="form.caldate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">计算数据</el-button>
  </el-form-item>
</el-form>    
</div>
</template>

<script>
import statistics from '@/api/statistics'
export default {
data(){
    return {
        form:{
            caldate:''
        }
    }
},
methods: {
      onSubmit() {
        console.log('submit!' + this.form.caldate);
        statistics.calDaily(this.form.caldate)
        .then(res=>{
            this.$message({
            type: "success",
            message: "计算成功!",
          })
        }).catch(()=>{
            this.$message({
            type: "error",
            message: "计算失败",
          });
        })
      },

    }
}
</script>

<style>

</style>