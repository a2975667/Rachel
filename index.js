var restify = require('restify');
var client = require('./reminderclient.js');
var builder = require('botbuilder');

var connector = new builder.ChatConnector();

var bot = new builder.UniversalBot(connector)


var APP_ID = 'b42b9e31-44a9-4deb-8bb5-9dd3d2b84898';
var SUB_KEY = '77f07e1255ed4d0592bb2157cd5d1621';
//const LuisModelUrl = 'https://api.projectoxford.ai/luis/v1/application?id=' + APP_ID + '&subscription-key=' + SUB_KEY ;
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + APP_ID + '?subscription-key=' + SUB_KEY + '&verbose=true';
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

function calendarEnding(session, results, next) {
    session.send('Add it to calendar');
}

function calendarEntity(session, args, next) {
    var entities = {};
    if (args) {
        entities = args.entities;
    }

    var event = {};
    for (var entity in entities) {
        if (entity.type == 'Info') {
            event.info = entity.entity
        }

    }
}

function attentionEntity(session, args, next) {
    var entities = {};
    console.log(args);
    if (args) {
        entities = args.entities;
    }

    var event = {};
    for (var entity of entities) {
        if (entity.type == 'Info') {
            event.info = entity.entity;
        }

        if (entity.type == 'disease') {
            event.disease = entity.entity;
        }

        if (entity.type == 'people') {
            event.people = entity.entity;
        }

        if (entity.type == 'verb') {
            event.verb = entity.entity;
        }

        if (entity.type == 'object') {
            event.object = entity.entity;
        }
    }
    console.log(event);
    session.beginDialog('/attentionEvent', event);
}

function attentionEnding(session, results, next) {
    console.log(results);
    if (results.disease) {
        if (results.disease == 'allergic') {
            client.addUnadble(results.people, results.object, 5566);
        } else {
            client.addDisease(results.disease, 5566);
        }
    } else {
        //client.addAttention
    }
    session.send('OK, I will remind you');
}



bot.dialog('/attentionEvent', [
    function (session, args, next) {
        session.dialogData.event = args;
        if (!args.people) {
            builder.Prompts.text(session, 'Who are you talking about?');
        } else {
            next();
        }
    },
    function (session, args, next) {
        event = session.dialogData.event;
        //console.log(args);
        if (args.response)
            event.people = args.response;
        //console.log(event);
        if (event.disease) {
            session.endDialogWithResult(event);
        } else if (event.verb && event.object) {
            session.endDialogWithResult(event);
        } else if (!event.verb) {
            builder.Prompts.text(session, 'What does ' + event.people + ' do?');
        } else {
            next();
        }
    },
    function (session, args, next) {
        event = session.dialogData.event;
        if (args.response)
            event.verb = args.response;
        if (event.object) {
            session.endDialogWithResult(event);
        } else {
            builder.Prompts.text(session, event.people + ' ' + event.verb + ' what?');
        }
    },
    function (session, args, next) {
        event = session.dialogData.event;
        event.object = args.response;
        session.endDialogWithResult(event);
    }
]);



function todoEnding(session, results, next) {
    session.send('Add it to todo list');
}


bot.dialog('/todoEvent', [
    function (session, args, next) {
        console.log(args);
        session.dialogData.event = args;
        if (!args.todoinfo) {
            builder.Prompts.text(session, 'What are you going to do ?');
        } else {
            next();
        }
    },
    function (session, args, next) {
        event = session.dialogData.event;
        if (args.response) {
            event.todoinfo = args.response;
        }
        session.endDialogWithResult(event);
    }
]);

function todoEntity(session, args, next) {
    var entities = {};
    console.log(args);
    if (args) {
        entities = args.entities;
    }
    event = {};
    for (var entity of entities) {
        console.log(entity.type);
        if (entity.type == 'Info') {
            event.todoinfo = entity.entity;
        }
        if (entity.type == 'people') {
            event.people = entity.entity;
        }
        if (entity.type.length > 16) {
            if (entity.type.slice(0, 16) == 'builtin.datetime') {
                event.endTime = entity.resolution.date;
            }
        }
        if (entity.type == 'object') {
            event.object = entity.entity;
        }
        if (entity.type == 'verb') {
            event.object = entity.entity;
        }
    }
    session.beginDialog('/todoEvent', event);
}

function todoEnding(session, results, next) {
    console.log(results);
    client.addTodo('5566', results);
    session.send('OK, we add new item into your todo list');
}

dialog.matches("Calendar", [
    function (session, args, next) {
        session.send('It is a calendar event');
        next();
    },
    calendarEnding
])
dialog.matches("Todo", [
    todoEntity,
    todoEnding
]);

dialog.matches("Attention", [
    attentionEntity,
    attentionEnding
]);

dialog.matches('Greeting', function (session, args, next) {
    session.beginDialog('/choice');
});


bot.dialog('/', dialog);
bot.dialog('/choice', [
    function (session, args, next) {
        builder.Prompts.choice(session, 'How may I help you?', ['Calendar', 'Todo', 'Attention', 'Todo']);
    },
    function (session, results) {
        if (results.response) {
            //session.beginDialog()
            var temp = {};
            if (results.response.index === 2) {
                session.beginDialog('/attentionEvent', temp);
            }else if(results.response.index == 3) {
               client.getMaster('5566', function(error, res, body){
                var reminder = JSON.parse(body).reminder;
                console.log(reminder);
                var str = '';
                for(var todo of reminder) {
                    str += todo.info + '\n\n';
                }
                session.send(str);
            });
        }
        session.endDialog();
    }}
]);


dialog.onDefault(function (session, args, next) {
    session.send('Sorry, I do not understand');
    session.beginDialog('/choice');
});

var server = restify.createServer();
server.listen(3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});

server.post('/api/messages', connector.listen());