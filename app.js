var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');
const { equal } = require('assert');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4501);

app.use(express.static(__dirname+ '/public'));

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_haneyad',
  password        : '7073',
  database        : 'cs290_haneyad'
});

module.exports.pool = pool;

app.get('/', function(req,res){
  res.render('index');
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    if (err) {
      console.log ("reset table: mysql error");
      res.render('index');
    } else {
      var createString = "CREATE TABLE workouts("+
      "id INT PRIMARY KEY AUTO_INCREMENT,"+
      "name VARCHAR(255) NOT NULL,"+
      "reps INT,"+
      "weight INT,"+
      "date DATE,"+
      "lbs BOOLEAN)";
      pool.query(createString, function(err){
        context.results = "Table reset";
        res.render('reset',context);
      })
    }
  });
});

/*app.post('/', function(req,res){
  let urlParams = [];
  for (let p in req.query){
    urlParams.push({'parameter':p, 'value':req.query[p]})
  }

  let urlData = {};
  urlData.urlList = urlParams;

  let bodyParams = [];
  for (let q in req.body){
    bodyParams.push({'parameter':q, 'value':req.body[q]})
  }
  console.log(bodyParams);
  console.log(req.body);
  let bodyData = {};
  bodyData.bodyList = bodyParams;

  res.render('index-post', {
    urlData : urlData,
    bodyData: bodyData
  });
});

app.get('/', function(req,res){
	let params = [];
  for (let p in req.query){
    params.push({'parameter':p, 'value':req.query[p]});
  }
  
  let data = {};
  data.dataList = params;
  res.render('index-get', data);
});
*/


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});