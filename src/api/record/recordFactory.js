import http from '../http'


export default {
    getRecord(userId,problemId,stateCode,groupId,contestId,page,itemsPerPage) {
        return http.get('/api/record/get/list', {
            userId:userId,
            problemId:'' + problemId,
            stateCode:stateCode,
            groupId:''+groupId,
            contestId:''+contestId,
            page:page,
            itemsPerPage:itemsPerPage
        })
    },
}