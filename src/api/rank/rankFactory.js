import http from '../http'


export default {
    getRank(page, itemsPerPage) {
        return http.get('/api/record/get/ranklist', {
            page: page,
            itemsPerPage: itemsPerPage,
        })
    },
    getRankInContest(contestId) {
        return http.get('/api/contest/'+contestId+'/rank', {})
    },
}