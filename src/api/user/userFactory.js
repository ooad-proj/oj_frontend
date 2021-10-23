import http from '../http'


export default {
    createUser(id,name,password,mail) {
        return http.post('/api/user',{
            id: id,
            name: name,
            password: password,
            mail: mail,

        })
    },
    getUserInfoSimple(page,itemsPerPage,search) {
        return http.get('/api/user/all',{
           page: page,
           itemsPerPage: itemsPerPage,
           search: search
        })
    },
    deleteUserInfo(id){
        return http.del(('/api/user/'+id),{
         id: id
        })
    },
    changeUserInfo(id,name,password,mail){
        // let url = '/api/user/'+id
        // console.log('url' + url)
        return http.put(('/api/user/'+id),{
            name : name,
            password: password,
            mail: mail
        })
    },
    getUserById(id){
        return http.get(('/api/user/details/'+id),{})
    }

}