
// Boilerplate to Setup
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var cors = require('cors');

var multer = require('multer');
var upload = multer();

var bodyParser = require('body-parser');
const { equal } = require('assert');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(upload.array());
app.use(express.static('public'));

app.use(cors());
app.options('*', cors());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4502);

app.use(express.static(__dirname+ '/public'));

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_haneyad',
  password        : 'PussyEater898!',
  database        : 'cs290_haneyad'
});

module.exports.pool = pool;


// Default GET request
// Runs SELECT on database
app.get('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      res.render('error')
      console.log("ERROR: SELECT");
      return;
    }
    context.dataList = rows;
    res.render('index', context);
  });
});


// Default POST request
// Sends new row data to SQL
app.post('/', function(req,res){
  var context = {};

  // Extract the values of the query from the req.body
  var inputList = [];
  for (let q in req.body) {
    inputList.push(req.body[q]);
  }

  // Convert strings to int where required
  var tempConvert = Number(inputList[1]);
  if (tempConvert === NaN) {
    alert("You entered an invalid number for Reps.")
  }
  inputList[1] = tempConvert;
  tempConvert = Number(inputList[2]);
  if (tempConvert === NaN) {
    alert("You entered an invalid number for Weight")
  }
  inputList[2] = tempConvert;

  // groom lbs for TRUE / FALSE
  tempConvert = inputList[4].toLowerCase();
  if (tempConvert == 'true'){
    inputList[4] = 1;
  } else {
    inputList[4] = 0;
  }

  // Attempt to make insert query
  pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?)", inputList, function(err, result){
    if(err){
      res.render('error');
      console.log(err);
      return;
    };
    console.log("ADD VIA TABLE INSERT SUCCESS");
    console.log(inputList);
    res.end();
  });
});


// RESETS Database 
//
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    if (err) {
      console.log ("reset table: mysql error");
      res.render('error');
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
        res.render('reset',{context: context, contextExists: true});
      })
    }
  });
});


// URL for populating table with TEST INSERTS
//
app.get('/insert',function(req,res,next){
  var context = {};
  pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES ('billy', 2, 50, '2021-05-04', 1)", function(err, result){
    if (err) {
      next(err);
      res.render('error');
      console.log("MYSQL INSERT ERROR");
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('index', {context: context, contextExists: true});
    console.log("URL /INSERT: SUCCESS");
  });
});


// SELECTS LAST ROW from Mysql after INSERT via POST request
//
app.get('/selectOnAdd', function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts ORDER BY id DESC LIMIT 1', function(err, rows, fields){
    if(err){
      next(err);
      res.render('error')
      console.log("ERROR: SELECT");
      return;
    }
    res.json(rows);
    console.log("SELECT: SUCCESS")
  });
});


// DELETES MySql Entry
//
app.post('/delete', function(req, res){
  console.log("REQUEST BODY: ", typeof(req.body));
  // Request body is application/x-www-form-urlencoded encoded
  // Results in key-value pairs
  let idKey = req.body['id'];
  queryStr = "DELETE FROM workouts WHERE id=" + idKey;

  pool.query(queryStr, function(err) {
    if(err){
      console.log("App.Post DELETE error");
      res.render('error');
      return
    }
    res.end();
    console.log("DELETE SUCCESS");
  })
});


// EDIT page for updating table entry
//
app.post('/edit', function(req,res,next){
  var context = {};
  let idKey = req.body['id'];
  pool.query('SELECT * FROM workouts WHERE id=' + idKey, function(err, rows, fields){
    if(err){
      next(err);
      res.render('error')
      console.log("ERROR: SELECT");
      return;
    }
    res.json(rows);
    console.log("SELECT: SUCCESS")
  });
});


// BOILERPLATE FOR STATUS CODES AND OPENING PORT

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

function convertToHtml(object) {
  let ctr = 0;
  let htmlString = '';
  for (ctr= 0; ctr < object.length; ctr++){
    htmlString = object[ctr].name
  }
}
