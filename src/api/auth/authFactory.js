import http from '../http'


export default {
  login (id,password) {
    return http.post('/api/auth/login',{
      id:id,
      password:password
    })
  },
  isLogin() {
    return http.get('/api/auth/isLogin')
  },
  getInfo() {
    return http.get('/api/auth/info')
  },
  logout() {
    return http.post('/api/auth/logout')
  },
  editInfo() {
    return http.put('/api/auth/info')
  },
  getRole() {
    return http.get('/api/auth/role')
  },
  getGroups() {
    return http.get('/api/auth/groups')
  },
  editPassword() {
    return http.put('/api/auth/password')
  }
  
}