import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  
    
    calDaily(date){
        return request({
            url:'/staticservice/statisticsdaily/getStaticsDay/'+ date,
            method:'get'
        })
    
    },
    getDailyCharts(queryForm){
        return request({
            url:`/staticservice/statisticsdaily/calDailyReport/${queryForm.type}/${queryForm.begin}/${queryForm.end}`,
            method:'get'
        })
    }






}
