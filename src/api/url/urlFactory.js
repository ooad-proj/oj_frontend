import http from '../http'
let baseURL = http.baseURL;
let sample_Download_URL_Start = baseURL + '/api/problem/testCase/' 
let sample_Download_URL_End = '/download'
let user_Code_URL_Start = baseURL + '/api/contest/'
let user_Code_URL_End =  '/export/accepted'
let user_Score_URL_Start = baseURL +'/api/contest/'
let user_Score_URL_End = '/export/score'
export default{
    sample_Download_URL_Start,
    sample_Download_URL_End,
    user_Code_URL_Start,
    user_Code_URL_End,
    user_Score_URL_Start,
    user_Score_URL_End
    
}