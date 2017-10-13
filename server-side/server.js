var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cron = require('node-schedule');
 


var User = require('./models/user');
var People = require('./models/people');
var Treatment = require('./models/treatment');

var app = express();
var port = process.env.PORT || 15000;
var router = express.Router();

mongoose.connect('RACHEL.DATABASE');

app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', function(req,res){
    res.json({message: "Rachel: how may I help?"});
});


//Helper//
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
//

cron.scheduleJob({hour: 8, minute: 35, dayOfWeek: 0}, function(){
    console.log('This runs at 2:30AM on every Sunday');
});


// Master code //

router.post('/createMaster', function(req,res){
    var master = new User();

    master.facebookid = req.body.facebookid;
    master.name = req.query.name;

    master.save(function(err){
        if (err) res.send(err);
        res.json({"message": "Added"});
    });
});

router.put('/master/:id/sick', function(req,res){
    var mid = req.params.id;
    var sick = req.body.sick; // this is an array
    var smart = req.body.smart;

    User.findOne({"facebookid":mid},function(err, user){
        
        for (var i = 0; i < sick.length; i++){
            Treatment.findOne({"name":sick[i]}, function(err, d){
                if (d === null){
                    return;
                }else{

                    var nlike = [];
                    var ndislike = [];
                    var have = [];
                    var not = [];

                    if (d.like !== null) {
                        nlike = d.like;
                        var old1 = user.like;
                        var empty1 = nlike.concat(old1);
                        old1 = [];
                        for (var i = 0; i < empty1.length; i++){
                            if (empty1[i] !== null && empty1[i] !== undefined) old1.push(empty1[i]);
                        }
                        var unique = old1.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var query1 = {"facebookid":mid}; 
                        var update1 = {"like":unique};
                        User.findOneAndUpdate(query1, update1,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }
                    if (d.dislike !== null) {
                        ndislike = d.dislike;
                        var old = user.ndislike;
                        var empty2 = ndislike.concat(old);
                        old = [];
                        for (var i = 0; i < empty2.length; i++){
                            if (empty2[i] !== null && empty2[i] !== undefined) old.push(empty2[i]);
                        }
                        var unique2 = old.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var query = {"facebookid":mid}; 
                        var update = {"dislike":unique2};
                        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }
                    if (d.have !== null) {
                        have = d.have;
                        var old3 = user.have;
                        var empty = have.concat(old3);
                        old3 = [];
                        for (var i = 0; i < empty.length; i++){
                            if (empty[i] !== null && empty[i] !== undefined) old3.push(empty[i]);
                        }
                        var unique3 = old3.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var query3 = {"facebookid":mid}; 
                        var update3 = {"have":unique3};
                        User.findOneAndUpdate(query3, update3,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }
                    if (d.not !== null) {
                        not = d.not;
                        var old4 = user.not;
                        var empty4 = not.concat(old4);
                        old4 = [];
                        for (var i = 0; i < empty4.length; i++){
                            if (empty4[i] !== null && empty4[i] !== undefined) old4.push(empty4[i]);
                        }
                        var unique4 = old4.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var query4 = {"facebookid":mid}; 
                        var update4 = {"not":unique4};
                        User.findOneAndUpdate(query4, update4,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }

                }
                
            });
        }

        var old = user.disease;
        var empty = sick.concat(old);
        old = [];
        for (var i = 0; i < empty.length; i++){
            if (empty[i] !== null) old.push(empty[i]);
        }
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var query = {"facebookid":mid}; 
        var update = {"disease":unique};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });

    });

});

router.put('/master/:id/like', function(req,res){
    var mid = req.params.id;
    var like = req.body.like; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.like;
        old.push(like);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var query = {"facebookid":mid}; 
        var update = {"like":unique};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/removelike', function(req,res){
    var mid = req.params.id;
    var like = req.body.like; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.like;
        old.remove(like);

        var query = {"facebookid":mid}; 
        var update = {"like":old};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/dislike', function(req,res){
    var mid = req.params.id;
    var dislike = req.body.dislike; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.dislike;
        old.push(dislike);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var query = {"facebookid":mid}; 
        var update = {"dislike":unique};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/removedislike', function(req,res){
    var mid = req.params.id;
    var dislike = req.body.dislike; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.dislike;
        old.remove(dislike);

        var query = {"facebookid":mid}; 
        var update = {"dislike":old};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/have', function(req,res){
    var mid = req.params.id;
    var have = req.body.have; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.have;
        old.push(have);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var query = {"facebookid":mid}; 
        var update = {"have":unique};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/removehave', function(req,res){
    var mid = req.params.id;
    var have = req.body.have; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.have;
        old.remove(have);

        var query = {"facebookid":mid}; 
        var update = {"have":old};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/not', function(req,res){
    var mid = req.params.id;
    var not = req.body.not; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.not;
        old.push(not);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var query = {"facebookid":mid}; 
        var update = {"not":unique};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/removenot', function(req,res){
    var mid = req.params.id;
    var not = req.body.not; //string

    User.findOne({"facebookid":mid},function(err, user){

        var old = user.not;
        old.remove(not);

        var query = {"facebookid":mid}; 
        var update = {"not":old};
        User.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/reminder', function(req,res){
    var mid = req.params.id;
    var key = String(Date.now());
    var info = req.body.todoinfo;
    var endTime = "";
    var people = [];
    var object = "";
    var verb = "";
    var query = {"facebookid":mid};

    User.findOne(query,function(err, user){
        if (req.body.endTime !== undefined) endTime = req.body.endTime;
        if (req.body.people !== undefined) people = req.body.people;
        if (req.body.object !== undefined) object = req.body.object;
        if (req.body.verb !== undefined) verb = req.body.verb;

        var todo = {
            "key": key,
            "info": info,
            "endTime": endTime,
            "people": people,
            "object": object,
            "verb": verb
        };

        var tmp = user.reminder;
        tmp.push(todo);

        User.findOneAndUpdate(query, tmp,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/master/:id/calender', function(req,res){
    var mid = req.params.id;
    var key = String(Date.now());
    var info = req.body.calinfo;
    var startTime = "";
    var endTime = "";
    var people = [];
    var object = "";
    var verb = "";
    var query = {"facebookid":mid};

    User.findOne(query,function(err, user){
        if (req.body.startTime !== undefined) startTime = req.body.startTime;
        if (req.body.endTime !== undefined) endTime = req.body.endTime;
        if (req.body.people !== undefined) people = req.body.people;
        if (req.body.object !== undefined) object = req.body.object;
        if (req.body.verb !== undefined) verb = req.body.verb;

        var cal = {
            "key": key,
            "info": info,
            "startTime":startTime,
            "endTime": endTime,
            "people": people,
            "object": object,
            "verb": verb
        };

        var tmp = user.calender;
        tmp.push(cal);

        User.findOneAndUpdate(query, tmp,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.get('/master/:id/reminder', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.reminder);
    });
});

router.get('/master/:id/calender', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.calender);
    });
});

router.get('/master/:id/like', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.like);
    });
});

router.get('/master/:id/dislike', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.dislike);
    });
});

router.get('/master/:id/have', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.have);
    });
});

router.get('/master/:id/not', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.not);
    });
});

router.get('/master/:id/disease', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user.disease);
    });
});

router.get('/master/:id', function(req,res){
    var mid = req.params.id;
    User.findOne({"facebookid":mid},function(err, user){
        if (err) res.send(err);
        res.json(user);
    });
});

//people api
router.post('/createpeople/:id', function(req, res){
    var people = new People();

    people.facebookid = req.params.id;
    people.name = req.body.name;

    people.save(function(err){
        if (err) res.send(err);
        res.json({"message": "Added"});
    });
});

router.put('/createpeople/:id/relation', function(req, res){
    var name = req.body.name;
    var query = {"facebookid": req.params.id, "name": name};

    People.findOneAndUpdate(query, {"relationship": req.body.relation}, function(err, doc){
        if (err) res.send(err);
        res.send(doc);
    });
});

router.put('/people/:id/:name/sick', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var sick = req.body.sick; // this is an array
    var smart = req.body.smart;

    People.findOne(query,function(err, user){
        
        for (var i = 0; i < sick.length; i++){
            Treatment.findOne({"name":sick[i]}, function(err, d){
                if (d == null){
                    return;
                }else{

                    var nlike = [];
                    var ndislike = [];
                    var have = [];
                    var not = [];

                    if (d.like !== null) {
                        nlike = d.like;
                        var old1 = user.like;
                        var empty1 = nlike.concat(old1);
                        old1 = [];
                        for (var i = 0; i < empty1.length; i++){
                            if (empty1[i] !== null && empty1[i] !== undefined) old1.push(empty1[i]);
                        }
                        var unique = old1.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var update1 = {"like":unique};
                        People.findOneAndUpdate(query, update1,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }
                    if (d.dislike !== null) {
                        ndislike = d.dislike;
                        var old = user.ndislike;
                        var empty = ndislike.concat(old);
                        old = [];
                        for (var l = 0; l < empty.length; l++){
                            if (empty[l] !== null && empty[l] !== undefined) old.push(empty[l]);
                        }

                        var unique2 = old.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });
                        var update = {"dislike":unique2};
                        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }
                    if (d.have !== null) {
                        have = d.have;
                        var old3 = user.have;
                        var empty3 = have.concat(old3);
                        old3 = [];
                        for (var k = 0; k < empty3.length; k++){
                            if (empty3[k] !== null && empty3[k] !== undefined) old3.push(empty3[k]);
                        }
                        var unique3 = old3.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var update3 = {"have":unique3};
                        People.findOneAndUpdate(query, update3,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }
                    if (d.not !== null) {
                        not = d.not;
                        var old4 = user.not;
                        var empty4 = not.concat(old4);
                        old4 = [];
                        for (var m = 0; m < empty4.length; m++){
                            if (empty4[m] !== null && empty4[m] !== undefined) old4.push(empty4[m]);
                        }
                        var unique4 = old4.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        var update4 = {"not":unique4};
                        People.findOneAndUpdate(query, update4,{upsert:false}, function(err, doc){
                            if (err) res.send(err);
                        });
                    }

                }
                
            });
        }

        var old = user.disease;
        var empty = sick.concat(old);
        old = [];
        for (var i = 0; i < empty.length; i++){
            if (empty[i] !== null) old.push(empty[i]);
        }
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });
        var update = {"disease":unique};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });

    });

});

router.put('/people/:id/:name/like', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var like = req.body.like; //string

    People.findOne(query,function(err, ppl){

        var old = ppl.like;
        old.push(like);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var update = {"like":unique};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/removelike', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var like = req.body.like; //string

    People.findOne(query,function(err, user){

        var old = user.like;
        old.remove(like);

        var update = {"like":old};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/dislike', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var dislike = req.body.dislike; //string

    People.findOne(query,function(err, ppl){

        var old = ppl.dislike;
        old.push(dislike);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var update = {"dislike":unique};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/removedislike', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var dislike = req.body.dislike; //string

    People.findOne(query,function(err, user){

        var old = user.dislike;
        old.remove(dislike);

        var update = {"dislike":old};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/have', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var have = req.body.have; //string

    People.findOne(query,function(err, ppl){

        var old = ppl.have;
        old.push(have);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var update = {"have":unique};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/removehave', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var have = req.body.have; //string

    People.findOne(query,function(err, user){

        var old = user.have;
        old.remove(have);

        var update = {"have":old};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/not', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var not = req.body.not; //string

    People.findOne(query,function(err, ppl){

        var old = ppl.not;
        old.push(not);
        var unique = old.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var update = {"not":unique};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.put('/people/:id/:name/removenot', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    var not = req.body.not; //string

    People.findOne(query,function(err, user){

        var old = user.not;
        old.remove(not);

        var update = {"not":old};
        People.findOneAndUpdate(query, update,{upsert:false}, function(err, doc){
            if (err) res.send(err);
            res.send("done");
        });
    });
});

router.get('/people/:id/:name/like', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    People.findOne(query,function(err, user){
        if (err) res.send(err);
        res.json(user.like);
    });
});

router.get('/people/:id/:name/dislike', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    People.findOne(query,function(err, user){
        if (err) res.send(err);
        res.json(user.dislike);
    });
});

router.get('/people/:id/:name/have', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    People.findOne(query,function(err, user){
        if (err) res.send(err);
        res.json(user.have);
    });
});

router.get('/people/:id/:name/not', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    People.findOne(query,function(err, user){
        if (err) res.send(err);
        res.json(user.not);
    });
});

router.get('/people/:id/:name/disease', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    People.findOne(query,function(err, user){
        if (err) res.send(err);
        res.json(user.disease);
    });
});

router.get('/people/:id/:name', function(req,res){
    var query = {"facebookid": req.params.id, "name": req.params.name};
    People.findOne(query,function(err, user){
        if (err) res.send(err);
        res.json(user);
    });
});




//developer: insert treatment
//sick?name=......
router.post('/dev/sick', function(req, res){
    
    var sname = req.query.name;

    var sick = new Treatment();

    sick.name = sname;
    sick.like = req.body.like;
    sick.dislike = req.body.dislike;
    sick.have = req.body.have;
    sick.not = req.body.not;

    sick.save(function(err){
        if (err) res.send(err);
        res.json({"message": "Added"});
    });
});


app.use('/api', router);

app.listen(port);
console.log("Rachel at port: " + port);