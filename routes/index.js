var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var yelp = require("yelp").createClient({
  consumer_key: process.env.oauth_consumer_key,
  consumer_secret: process.env.consumerSecret,
  token: process.env.oauth_token,
  token_secret: process.env.tokenSecret,
});
var db = require('monk')(process.env.MONGOLAB_URI || process.env.bar_List);
var hhCollection = db.get('hh');
//var GoogleMapsLoader = require('google-maps');

router.get('/', function(req, res, next){
  hhCollection.find({},function(err, data){
    //for(var offset=20; offset=400; offset+20){
      yelp.search({term: "happy hour", location: "denver"}, function(error, data) {
        console.log(error);
        console.log(data.businesses);

        hhCollection.insert(data.businesses);
      });
    //}
    //console.log(data)*/
    res.render('index', {allbars: data, title: "All the Bars"});
  });
});

router.get('/bars/:id', function(req,res,next){
  hhCollection.findOne({_id:req.params.id}, function(err,bar){
    res.render('show',{bar:bar, title:bar.name, api:process.env.google_Key});
  });
});

router.post("/new", function(req, res, next){
  var rating=Number(req.body.rating);
  console.log(req.body.neighborhood.length);
  console.log(rating);
  if(req.body.rating.length>0 && req.body.neighborhood.length>0){
    hhCollection.find({rating:rating, "location.neighborhoods":req.body.neighborhood}, function(err, bar){
      res.render("new",{bar:bar});

    });

  }else if (rating===0 && req.body.neighborhood.length>0){
    hhCollection.find({"location.neighborhoods":req.body.neighborhood}, function(err, bar){


      res.render("new",{bar:bar});
    });

  }else{//(rating>0 && req.body.neighborhood.length<0){
    hhCollection.find({rating:rating}, function(err, bar){
      res.render("new", {bar:bar});
    });
  }

});

router.post('/bars/:id', function(req, res, next) {
  hhCollection.update({_id: req.params.id},{ hhurl: req.body.hhurl, hhmenu: req.body.hhmenu , start: req.body.stime, end: req.body.etime},function(err,bar){
    res.redirect('/bars/'+ req.params.id);

  });
});




module.exports = router;
