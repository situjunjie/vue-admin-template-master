import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  
    //第一步添加课程基本信息
    addCourseInfo(courseInfo){

        return request({
            url:'/eduservice/course/addCourseInfo',
            method:'post',
            data:courseInfo
        })
    
    },
    getAllTeacherList(){//获取下拉列表所有讲师信息
        return request({
            url:'/eduservice/edu-teacher',
            method:'get'
        })
    },

    getCourseInfoById(id){    //返回上一步时获取表单信息
        return request({
            url:'/eduservice/course/getCourseInfo/'+id,
            method:'get'
        })
    },

    updateCourseInfo(form){ //重新编辑更新课程信息
        return request({
            url:'/eduservice/course/updateCourseInfo',
            method:'put',
            data:form
        })
    },

    queryCourseList(page,limit,form){
        return request({
            url:'/eduservice/course/course-list/'+page+'/'+limit,
            method:'post',
            data:form
        })
    },

    deleteCourseById(id){
        return request({
            url:'/eduservice/course/delete-course/'+id,
            method:'delete'
        })
    }


}
