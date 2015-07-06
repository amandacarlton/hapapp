var express = require('express');
var router = express.Router();
var bcrypt= require('bcrypt');
var unirest = require('unirest');
var yelp = require("yelp").createClient({
  consumer_key: process.env.oauth_consumer_key,
  consumer_secret: process.env.consumerSecret,
  token: process.env.oauth_token,
  token_secret: process.env.tokenSecret,
});
//var itunes=require("itunes-search");
var hhdb = require('monk')(process.env.MONGOLAB_URI || process.env.bar_List);
var userdb= require('monk')(process.env.MONGOLAB_URI || "localhost/hhuserslist");
var itunesdb= require('monk')(process.env.MONGOLAB_URI || 'localhost/itunes');
var favdb= require('monk')(process.env.MONGOLAB_URI || 'localhost/fav');
var hhCollection = hhdb.get('hh');
var userCollection = userdb.get('user');
var itunesCollection= itunesdb.get('track');
var favCollection= favdb.get('fav');
var validator= require('../lib/validations.js');
//var GoogleMapsLoader = require('google-maps');

router.get('/', function(req, res, next){
  // //   var options = {
  // //     media: "music"
  // //   , entity: "music"
  // //   , limit: 25
  // // };
  //
  // itunes.search( "kanye",
  // function(response) {
  //   console.log(response);
  // });

  hhCollection.find({},function(err, data){
    //for(var offset=20; offset=400; offset+20){
    // yelp.search({term: "happy hour", location: "denver"}, function(error, data) {
    //   console.log(error);
    //   console.log(data.businesses);
    //
    //   hhCollection.insert(data.businesses);
    // });
    //}
    //console.log(data)*/
    res.render('index', {allbars: data, title: "All the Bars"});
  });
});

router.get('/bars/:id', function(req,res,next){
  hhCollection.findOne({_id:req.params.id}, function(err,bar){
    var name= req.cookies.currentuser;
    userCollection.findOne({firstname:name}, function(err, user){
    console.log(user);
    res.render('show',{bar:bar, user:user, title:bar.name, api:process.env.google_Key});
  });
});
});


router.post("/bars/new", function(req, res, next){
 var rating=Number(req.body.rating);
  if(req.body.rating.length>0 && req.body.neighborhood.length>0){
    hhCollection.find({rating:rating, "location.neighborhoods":req.body.neighborhood}, function(err, bar){
      res.render("new",{bar:bar, rating:rating, neighborhood:req.body.neighborhood});

    });

  }else if (rating===0 && req.body.neighborhood.length>0){
    hhCollection.find({"location.neighborhoods":req.body.neighborhood}, function(err, bar){


      res.render("new",{bar:bar, rating:rating, neighborhood:req.body.neighborhood});
    });

  }else{//(rating>0 && req.body.neighborhood.length<0){
    hhCollection.find({rating:rating}, function(err, bar){
      res.render("new", {bar:bar, rating:rating, neighborhood:req.body.neighborhood});
    });
  }

});

router.post('/bars/:id', function(req, res, next) {
  console.log(req.body.stime);
  hhCollection.update({_id: req.params.id},{'$set':{ hhurl: req.body.hhurl, hhmenu: req.body.hhmenu , start: req.body.stime, end: req.body.etime}},function(err,bar){
    //console.log(bar);
    res.redirect('/bars/'+ req.params.id);

  });
});

router.get("/signup", function(req, res, next){
  if(req.cookies.currentuser){
  var person= req.cookies.currentuser;
  res.render("signup", {Success: "You have successfully created an account!", person:person});
}else if(req.cookies.currentuser === "undefined"){
  res.redirect("/");
}
});

router.post('/signup', function(req, res, next) {
  userCollection.find({}, function(err, info){
  var input= req.body;
  var errorlist=(validator.create(input.createfName, input.createlName, input.createEmail, input.createPass, info));
  if(errorlist.length >0){
  res.render('index', {errorlist:errorlist});
}else{
  res.cookie('currentuser', req.body.createfName);
  var hash = bcrypt.hashSync(req.body.createPass, 8);
  userCollection.insert({ email: req.body.createEmail, password: hash, firstname: req.body.createfName, lastname: req.body.createlName}, function(err, data){
  res.redirect('/signup');
});
}
});
});


router.get('/login', function(req, res, next){
  if(req.cookies.currentuser){
    var name= req.cookies.currentuser;
  favCollection.find({username:name}, function(err, data){
    res.render("login", {name:name, opinion:data});
  });
  }else if(req.cookies.currentuser === "undefined"){
    res.redirect("/");
  }
});


router.post('/login', function(req, res, next){
  userCollection.findOne({email:req.body.loginEmail}, function(err, data){
    if(data){
      var compare= data.password;
      var name= data.firstname;
      var statement;
      if (bcrypt.compareSync(req.body.loginPass, compare)){
        res.cookie('currentuser', name);
        res.redirect("/login");
      }else{
        statement="Password does not match";
        res.render("index", {statement:statement, title:"All the Bars"});
      }
    }
    else{
      var message="Email does not exist";
      res.render("index", {message:message, title:"All the Bars"});
    }

  });
});


router.post("/itunes/:id", function(req, res, next){
  hhCollection.findOne({_id:req.params.id}, function(err,bar){
    var name= req.cookies.currentuser;
    userCollection.findOne({firstname:name}, function(err, user){
      unirest.post('https://itunes.apple.com/search?term='+req.body.music+'&limit='+req.body.limit)
      .end(function (response) {
        var data= JSON.parse(response.body);
        //console.log(response.body);
        //console.log(data);
        res.render('show', {response:data.results, bar:bar, title:bar.name, user:user, api:process.env.google_Key});
      });

    });
  });
});

router.post("/vote/:id", function(req, res, next){
  hhCollection.findOne({_id:req.params.id}, function(err,bar){
    var name= req.cookies.currentuser;
    userCollection.findOne({firstname:name}, function(err, user){
      unirest.post('https://itunes.apple.com/search?term='+req.body.music+'&limit='+req.body.limit)
      .end(function (response) {
        var data= JSON.parse(response.body);
        itunesCollection.insert({ username: req.body.name, userid: req.body.userid, bar: req.body.barname, date: req.body.date, trackName: req.body.trackName});
        itunesCollection.find({bar:req.body.barname, date:req.body.date}, function(err, data){
          var result = {};
          for(var i=0; i<data.length; i++) {
            result[data[i].trackName] = result[data[i].trackName] || 0;
            result[data[i].trackName] += 1;
          }
          res.render('show', {vote:result, response:data.results, bar:bar, title:bar.name, user:user, api:process.env.google_Key});
        });
      });
    });
  });
});

router.post("/logout", function(req, res, next){
  res.clearCookie('currentuser');
  res.redirect("/");
});

router.post("/opinion", function(req, res, next){
  var name= req.cookies.currentuser;
  userCollection.findOne({firstname:name}, function(err, user){
    favCollection.insert({user:req.body.userid, username:req.body.username, bar:req.body.barname, like:req.body.love});
    res.redirect("/login");
  });
});


// router.post("/itunes", function(req, res, next){
//   var options = {
//     media: "music"
//   , entity: "music"
//   , limit: 25
// };
//
// itunes.search( "kanye", options,
// function(response) {
//   console.log(response);
//   res.render("show");
// });
// });
// router.post("/logout", function(req, res, next){
//   res.redirect
// }





module.exports = router;
