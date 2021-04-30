import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  
    //分页条件查询的方法  参数：页数，每页记录数，查询条件对象
    getTeacherPageList(page,limit,searchObj){

        return request({
            url:'/eduservice/edu-teacher/getMoreConditionPageList/'+page+'/'+limit,
            method:'post',
            //传递条件对象，
            //如果传递的时json 那么用data  否则用params
            data:searchObj
        })
    },
    //删除讲师信息
    deleteTeacherById(id){
        return request({
            url:'/eduservice/edu-teacher/'+id,
            method:'delete'
        })
    },

    //添加讲师信息
    addTeacher(teacher){
        return request({
            url:'/eduservice/edu-teacher/addTeacherInfo',
            method:'post',
            data:teacher
        })
    },

    //根据id查询讲师信息
    getTeacherById(id){
        return request({
            url:'/eduservice/edu-teacher/getTeacherInfo/'+id,
            method:'get'
        })
    },

    //修改讲师信息
    updateTeacher(teacher){
        return request({
            url:'/eduservice/edu-teacher/updateTeacherInfo',
            method:'put',
            data:teacher
        })
    }
}
