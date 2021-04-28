<template>
    <div class="app-container">讲师列表</div>
</template>

<script>
import teacher from '@/api/teacher'
export default{
    
    data(){
        return {list:null,//每页数据list集合
        page:1, //当前页,
        limit:4,//每页记录数
        searchObj:{}
        }
    },
    created(){
        this.getListTeacher()
    },
    methods:{
        getListTeacher(page=1){
            this.page=page
            teacher.getTeacherPageList(this.page,this.limit,this.searchObj)
                .then(response=>{
                    console.log(response)
                })  //请求成功，返回状态码20000，执行then里面的操作
                .catch(error=>{ 

                }) //请求失败，执行.catch
        }
    }
}

</script>
