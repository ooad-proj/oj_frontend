import http from '../http'


export default {
    getMYContestAdministrator(page, itemsPerPage, search) {
        return http.get('/api/contest/admin', {
            page: page,
            itemsPerPage: itemsPerPage,
            search: search
        })
    },

    deleteContest(contestId) {
        return http.del('/api/contest/' + contestId, {
        })
    },
    addContest(groupId,title,description,startTime,endTime){
        return http.post('/api/contest/group/'+groupId, {
            title:title,
            description:description,
            startTime:startTime,
            endTime:endTime
        })
    },
    changeContestBasicInfo(contestId,title,description,startTime,endTime,access){
        return http.put('/api/contest/'+contestId, {
            title:title,
            description:description,
            startTime:startTime,
            endTime:endTime,
            access:access
        })
    },
    getContestInfo(contestId){
        return http.get('/api/contest/'+contestId+'/answering', {})
    },
    getContestWithDDL(amount) {
        return http.get('/api/contest/ddl', {amount: amount})
    }
}