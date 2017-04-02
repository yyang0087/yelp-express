var express = require('express')
var app = express()
/**
var logger = function(req, res, next) {
	console.log('loggggg');
	next();
}
app.use(logger);
*/

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

var person = [
	{
		name: 'jeff',
		age: 30
	},
	{
		name: 'jeffff',
		age: 303
	},
	{
		name: 'jeffffff',
		age: 3034
	}
]


app.get('/', function (req, res) {
  res.send('Hello World!')
  res.json(person);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})