import http from '../http'


export default {
    addForum(groupId,title,content,goPublic,goMail) {
        return http.post('/api/forum/'+groupId, {
            title:title,
            content:content,
            goPublic:goPublic,
            goMail:goMail,
        })
    },
}