import http from '../http'


export default {
    getMyProblem(page, itemsPerPage, search) {
        return http.get('/api/problem/admin', {
            page: page,
            itemsPerPage: itemsPerPage,
            search: search
        })
    },
    deleteProblem(problemId) {
        return http.del('/api/problem/' + problemId, {})
    },
    addSample(groupId, zipFile) {
        let url = '/api/problem/testCase/' + groupId
        let data = new FormData();
        data.append("file", zipFile);
        let header = { "Content-Type": "multipart/form-data;" };
        return new Promise((resolve, reject) => {
            http.instance.post(url, data, header).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
    },
    addProblem(contestId, shownId, title, description, inputFormat, outputFormat, samples, tips, timeLimit, spaceLimit, allowedLanguage, testCaseId, submitTemplate, scoreRule,allowDetailedResult) {
        let problem = {
            shownId: shownId,
            title: title,
            description: description,
            inputFormat: inputFormat,
            outputFormat: outputFormat,
            samples: samples,
            tips: tips,
            timeLimit: timeLimit,
            spaceLimit: spaceLimit,
            allowedLanguage: allowedLanguage,
            testCaseId: testCaseId,
            allowDetailedResult:allowDetailedResult,
            submitTemplate: submitTemplate,
            // scoreRule: scoreRule
            totalScore: scoreRule.totalScore,
            punishRule: scoreRule.punishRule,
            allowPartial: scoreRule.allowPartial
        }
        let url = '/api/problem/contest/' + contestId
        // let header = { "Content-Type": "application/json;" };
        return new Promise((resolve, reject) => {
            http.instance.post(url, problem).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
        // return http.post('/api/problem/contest/' + contestId, {
        //     problem:{shownId: shownId,
        //     title: title,
        //     description: description,
        //     inputFormat: inputFormat,
        //     outputFormat: outputFormat,
        //     samples: samples,
        //     tips: tips,
        //     timeLimit: timeLimit,
        //     spaceLimit: spaceLimit,
        //     allowedLanguage: allowedLanguage,
        //     testCaseId: testCaseId,
        //     submitTemplate: submitTemplate,
        //     scoreRule: scoreRule}
        // })
    },
    getProblemInfo(problemId) {
        return http.get('/api/problem/answering/' + problemId, {})
    },
    editProblemInfo(problemId, shownId, title, description, inputFormat, outputFormat, samples, tips, timeLimit, spaceLimit, allowedLanguage, testCaseId, submitTemplate, scoreRule,allowDetailedResult) {
        let problem = {
            shownId: shownId,
            title: title,
            description: description,
            inputFormat: inputFormat,
            outputFormat: outputFormat,
            samples: samples,
            tips: tips,
            timeLimit: timeLimit,
            spaceLimit: spaceLimit,
            allowedLanguage: allowedLanguage,
            testCaseId: testCaseId,
            allowDetailedResult:allowDetailedResult,
            submitTemplate: submitTemplate,
            // scoreRule: scoreRule
            totalScore: scoreRule.totalScore,
            punishRule: scoreRule.punishRule,
            allowPartial: scoreRule.allowPartial
        }
        let url = '/api/problem/' + problemId
        // let header = { "Content-Type": "application/json;" };
        return new Promise((resolve, reject) => {
            http.instance.put(url, problem).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
        // return http.put('/api/problem/'+problemId, {
        //     shownId: shownId,
        //     title: title,
        //     description: description,
        //     inputFormat: inputFormat,
        //     outputFormat: outputFormat,
        //     samples: samples,
        //     tips: tips,
        //     timeLimit: timeLimit,
        //     spaceLimit: spaceLimit,
        //     allowedLanguage: allowedLanguage,
        //     testCaseId: testCaseId,
        //     submitTemplate: submitTemplate,
        //     scoreRule: scoreRule
        // })
    },
    getAnswerableProblem(page, itemsPerPage, search) {
        return http.get('/api/problem/answering', {
            search: search,
            page: page,
            itemsPerPage: itemsPerPage
        })
    },
    getAnswerOfProblem(problemId){
        return http.get('/api/problem/standardAnswer/'+problemId,{

        })
    },
    editAnswerOfProblem(problemId,answer,isPublish){
        let data ={
            answer:answer,
            isPublish:isPublish
        } 
        let url = '/api/problem/standardAnswer/' + problemId
        // let header = { "Content-Type": "application/json;" };
        return new Promise((resolve, reject) => {
            http.instance.put(url, data).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
        // return http.put('/api/problem/standardAnswer/'+problemId,{
        //     answer:answer
        // })
    },
}