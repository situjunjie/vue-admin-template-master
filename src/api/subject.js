import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  
    //分页条件查询的方法  参数：页数，每页记录数，查询条件对象
    getAllSubjectTree(){

        return request({
            url:'/eduservice/edu-subject/getAllSubjectTree',
            method:'get'
        })
    },
    deleteSubjectBtId(id){
        return request({
        url:'/eduservice/edu-subject/deleteSubjectById/'+id,
        method:'delete'
    })
    },
    
    addFirstSubject(subject){
        return request({
        url:'/eduservice/edu-subject/addFirstSubject',
        method:'post',
        data:subject
    })
    },

    addSecondSubject(subject){
        return request({
        url:'/eduservice/edu-subject/addSecondSubject',
        method:'post',
        data:subject
    })
    }
}
