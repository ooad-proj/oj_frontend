import http from '../http'


export default {
    getRecord(userId,problemId,stateCode,page,itemsPerPage) {
        return http.get('/api/record/get/list', {
            userId:userId,
            problemId:'' + problemId,
            stateCode:stateCode,
            page:page,
            itemsPerPage:itemsPerPage
        })
    },
}