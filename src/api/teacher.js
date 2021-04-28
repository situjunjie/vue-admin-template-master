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
    }
}
