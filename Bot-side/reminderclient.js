var querystring = require('querystring');
var request = require('request');

module.exports = {
    createUser: function (username, callback) {
        request.post({
            url: '',
            formData: {
                username: username
            }
        }, callback);
    },

    getMaster: function(id, callback) {
        request.get({
            url: 'http://2017rachel.azurewebsites.net/api/master/' + id
        }, callback);
    }, 

    addAttention: function (person, attention, callback) {
        request.post({
            url: '',
            form: {
                person: person,
                attention: attention
            }
        }, callback);
    },

    addDisease: function(sick, id, callback) {
        request.put({
            url: 'http://2017rachel.azurewebsites.net/api/master/' + id + '/sick',
            form: {
                sick: [sick]
            }
        }, callback);
    },

    addUnadble: function(name, not, id, callback) {
        request.put({
            url: 'http://2017rachel.azurewebsites.net/api/people/' + id + '/' + name + '/not',
            form: {
                not: not
            }
        }, callback);
    },

    addCalendar: function(content, startTime, endTime, callback) {
        request.post({
            url: '',
            formData: {
                content: content,
                startTime: startTime,
                endTime, endTime
            }
        }, callback);
    },

    addTodo: function(id, json, callback) {
        request.put({
            url: 'http://2017rachel.azurewebsites.net/api/master/' + id + '/reminder',
            form: json
        }, callback);
    },

}
