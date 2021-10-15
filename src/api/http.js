import axios from 'axios'
import router from '../router/index'

let instance = axios.create({
  baseURL:"http://mockjs.docway.net/mock/1itkXEuHAcj"
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
instance.defaults.timeout = 10000;

instance.interceptors.response.use(
  response => {
    if (response.status === 200) {            
      return Promise.resolve(response);        
    } else {            
      return Promise.reject(response);        
    }
  },
  error => {
    if (error.response.status) {            
      switch (error.response.status) {               
        case 401:                    
            router.push('/login')
          break;
               
        case 403:
          //用户无权限
          break; 
      }
      return Promise.reject(error.response);
    }
  }    
);

let get = function(url, params) {    
  return new Promise((resolve, reject) =>{        
      instance.get(url, {            
          params: params        
      }).then(res => {
          resolve(res.data);
      }).catch(err =>{
          reject(err.data)        
  })    
});}

let post = function(url, params) {    
  return new Promise((resolve, reject) =>{        
      instance.post(url, params).then(res => {
          resolve(res.data);
      }).catch(err =>{
          reject(err.data)        
  })    
});}

let del = function(url, params) {    
  return new Promise((resolve, reject) =>{        
      instance.get(url, params).then(res => {
          resolve(res.data);
      }).catch(err =>{
          reject(err.data)        
  })
});}

let put = function(url, params) {    
  return new Promise((resolve, reject) =>{        
      instance.get(url, params).then(res => {
          resolve(res.data);
      }).catch(err =>{
          reject(err.data)        
  })
});}

export default {instance, get, put, del, post}