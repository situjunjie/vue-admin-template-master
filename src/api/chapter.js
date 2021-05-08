import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  
    
    getChapterVideoList(id){

        return request({
            url:'/eduservice/edu-chapter/getChapterList/'+id,
            method:'get'
        })
    
    },

    // /eduservice/edu-chapter/addChapter
    addChapter(chapter){
        return request({
            url:'/eduservice/edu-chapter/addChapter',
            method:'post',
            data:chapter
        })
    },

    // /eduservice/edu-chapter/deleteChapterById/{id}
    deleteChapterById(id){
        return request({
            url:'/eduservice/edu-chapter/deleteChapterById/'+id,
            method:'delete'
        })
    },

    // /eduservice/edu-chapter/updateChapter
    updateChapter(chapter){
        return request({
            url:'/eduservice/edu-chapter/updateChapter',
            method:'put',
            data:chapter
        })
    }




}
