import http from '../http'


export default {
    getGroup(page, itemsPerPage, search) {
        return http.get('/api/group', {
            page: page,
            itemsPerPage: itemsPerPage,
            search: search
        })
    },
    createGroup(name) {
        return http.post('/api/group/' + name, {})
    },
    deleteGroup(id) {
        return http.del('/api/group/' + id, {})
    },
    editGroupName(newName, id) {
        return http.put('/api/group/' + id, {
            newName: newName
        })
    },
    getUserInGroup(groupId, page, itemsPerPage, search) {
        return http.get('/api/group/' + groupId + '/members', {
            page: page,
            itemsPerPage: itemsPerPage,
            search: search
        })
    },
    addUserInGroup(groupId, memberId) {
        return http.post('/api/group/' + groupId + '/member/' + memberId, {})
    },
    addManyUserInGroup(groupId, csvFile) {
        let url = '/api/group/' + groupId + '/member/add/batch'
        let data = new FormData();
        data.append("file", csvFile);
        let header = { "Content-Type": "multipart/form-data;" };
        return new Promise((resolve, reject) => {
            http.instance.post(url, data, header).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
    },
    deleteUserInGroup(groupId, memberId) {
        return http.del('/api/group/' + groupId + '/member/' + memberId, {})
    },
    getAssistantInGroup(groupId) {
        return http.get('/api/group/' + groupId + '/assistants', {})
    },
    deleteAssistantInGroup(groupId, assistantId) {
        return http.del('/api/group/' + groupId + '/assistant/' + assistantId, {})
    },
    addAssistantInGroup(groupId, assistantId) {
        return http.post('/api/group/' + groupId + '/assistant/' + assistantId, {})
    },
    getDataInGroup(groupId) {
        return http.get('/api/group/' + groupId, {})
    }
}