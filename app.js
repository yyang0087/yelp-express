var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var expressValidator = require('express-validator');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// BEGIN MY WORK

app.use('/static', express.static('public'));
//var tools = require('./public/javascripts/sample.js');

//Global vars
app.use(function(req, res, next) {
	res.locals.errors = null;
	next();
});
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.get('/', function(req, res){
  res.render('layout', {
    title: "Yu-Lin's Yelp Recommender"
  });
});



	const yelp = require('yelp-fusion');
	// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
	// from https://www.yelp.com/developers/v3/manage_app
	const clientId = 'eiCmbuqsp7TaKYKnU56B1Q';
	const clientSecret = 'g29rAZm68EiPMLvts1PqZNBLyao0eePBnLzotQ9vIpKRjIRWyIfsYzpWx4WYQWji';


//rando
app.post('/', function(req, res) {
	console.log('random form submitted');
	//const output = tools.bar();
	//Assume this post request was the random selector unless otherwise specified
	var rand = true;
	if(req.body.latitude == null) {
		rand = false;
	}

	console.log(req.body.search + req.body.latitude2);



	var searchRequest = {};
	//if random, set random request
	if(rand) {
		var sort = "rating";
		switch(Math.floor(Math.random()*4)) {
			case 0:
				sort = "best_match"
				break;
			case 1:
				sort = "rating"
				break;
			case 2:
				sort = "review_count"
				break;
			case 3:
				sort = "distance"
				break;
		}
		searchRequest = {
			latitude: req.body.latitude,
			longitude: req.body.longitude,
		  	term:'restaurant',
		  	sort_by: sort,
		  	offset: Math.floor(Math.random()*(50))
		  //location: 'chicago, il'
		};
	}
	//if search, check search query
	else {
		req.checkBody('search', 'Search term required').notEmpty();
		var errors = req.validationErrors();
		if(errors) {
			console.log('there areerrors');
		    res.render('layout', {
		    	title: "Yu-Lin's Yelp Recommender",
		    	errors: errors,
		    	click: false
		    });
		    console.log(errors[0].msg);
		    return;
		} 
		else {
			searchRequest = {
				latitude: req.body.latitude2,
				longitude: req.body.longitude2,
			  	term: req.body.search,
			  	sort_by: "best_match"
			};
		}
	}
	

	yelp.accessToken(clientId, clientSecret).then(response => {
	  const client = yelp.client(response.jsonBody.access_token);

	  client.search(searchRequest).then(response => {
	  	var i = response.jsonBody.businesses.length;
	    const firstResult = response.jsonBody.businesses[Math.floor(Math.random()*(i))];
		    
	    var result =[];
	    var queries = 10;
	    if(response.jsonBody.businesses.length < 10) {
	    	queries = response.jsonBody.businesses.length;
	    }
	    for (var i = 0; i < queries; i++) {
	      var n = response.jsonBody.businesses[i].name;
	      var r = response.jsonBody.businesses[i].price;
	      var u = response.jsonBody.businesses[i].url;
	      var p = response.jsonBody.businesses[i].image_url;
	      var d = Math.floor(response.jsonBody.businesses[i].distance)/1000;
	      result.push({name: n, rating: r, url: u, image: p, distance: d});

	    }
	    //console.log(result);




	    //const prettyJson = JSON.stringify(firstResult, null, 4);
	    //const prettyJson = JSON.stringify(result);
	    //console.log(prettyJson);
	    res.render('layout', {
	    	title: "Yu-Lin's Yelp Recommender",
	    	list: result,
	    	click: true
	    });

	    //console.log(prettyJson);
	    //console.log("hi");
	  });
	}).catch(e => {
	  console.log(e);
		});


});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
