import http from '../http'


export default {
    testAnswer(problemId,code,testCase,language) {
        return http.post('/api/submit/standard/'+problemId,{
            code:code,
            testcase:testCase,
            language:language
        })
    },
    submitAnswer(problemId,language,code){
        return http.post('/api/submit/'+problemId,{
            language:language,
            code:code,
        })
    },
    getsubmitAnswer(recordId){
        return http.get('/api/record/'+recordId,{
            
        })
    },
    getTestResult(recordId){
        return http.get('/api/record/standard/'+recordId,{
            
        })
    },
    ifHaveAnswer(problemId){
        return http.get('/api/submit/haveAnswer/'+problemId,{

        })
    }
 

}