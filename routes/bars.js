var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/album_class_demo');
var albumCollection = db.get('albums');



/*router.get('/', function(req, res, next) {


  // See http://www.yelp.com/developers/documentation/v2/search_api

  yelp.search({term: "happy hour", location: "denver", offset:20}, function(error, data) {
    console.log(error);
    console.log(data);
    var data = data
  hhCollection.insert({data:data})
  });

  // See http://www.yelp.com/developers/documentation/v2/business

  res.render('index', { title: 'Happy Hour' });
});

router.get('/', function(req, res, next) {


  // See http://www.yelp.com/developers/documentation/v2/search_api

  yelp.search({term: "happy hour", location: "denver", offset:40}, function(error, data) {
    console.log(error);
    console.log(data);
    var data = data
  hhCollection.insert({data:data})
  });

  // See http://www.yelp.com/developers/documentation/v2/business

  res.render('index', { title: 'Happy Hour' });
});*/

//for(var offset=0; offset=300; offset+20){
module.exports=router;
