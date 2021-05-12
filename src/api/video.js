import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  
    
    getVideo(id){

        return request({
            url:'/eduservice/edu-video/getVideo/'+id,
            method:'get'
        })
    
    },

    addVideo(video){

        return request({
            url:'/eduservice/edu-video/addVideo',
            method:'post',
            data:video
        })
    
    },
    updateVideo(video){

        return request({
            url:'/eduservice/edu-video/updateVideo',
            method:'put',
            data:video
        })
    
    },
    deleteVideoById(id){
        return request({
            url:'/eduservice/edu-video/deleteVideo/'+id,
            method:'delete'
        })
    
    },

    deleteAliyunVideo(videoId){
        return request({
            url:'/vidservice/vod/'+videoId,
            method:'delete'
        })
    }






}
