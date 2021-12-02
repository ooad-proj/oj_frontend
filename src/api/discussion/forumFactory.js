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
    getForumList(groupId,page,itemsPerPage,search){
        return http.get('/api/forum/'+groupId,{
            page:page,
            itemsPerPage:itemsPerPage,
            search:search
        })
    },
    getPublic(groupId,length){
        return http.get('/api/forum/'+groupId+'/announcement',{
            length:length
        })
    },
    getPostInfo(postId){
        return http.get('/api/forum/post/'+postId,{})
    },
    getComment(postId,page,itemsPerPage){
        return http.get('/api/forum/post/'+postId+'/comment',{
            page:page,
            itemsPerPage:itemsPerPage
        })
    },
    deletePost(postId){
        return http.del('/api/forum/post/'+postId,{})
    },
    addComment(postId,comment){
        return http.post('/api/forum/post/'+postId+'/comment',{
            comment:comment
        })
    },
    deleteComment(commentId){
        return http.del('/api/forum/comment/'+commentId,{})
    },
    //TODO
    editPost(postId,item){
        return http.put('/api/forum/post/'+postId,{
            title: item.title,
            content: item.content,
            goPublic: item.goPublic
        })
    }
}