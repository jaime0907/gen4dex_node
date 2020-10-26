const express = require('express')
const path = require('path');
const Database = require('better-sqlite3');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nunjucks = require('nunjucks');

const app = express()
const port = 3000

// Configure Nunjucks
var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/templates' : 'templates' ;
nunjucks.configure( _templates, {
    autoescape: true,
    cache: false,
    express: app
} ) ;

app.engine('html', nunjucks.render)
app.set('view engine', 'html');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const db = new Database('gen4dex_db.sqlite3');

app.use(express.static('public'));

app.get('/', (req, res) => {
	//res.sendFile(path.join(__dirname + '/html/index.html'));
	res.render('index', {islogged: false, username: "USERNAMEE"})
})

app.post('/post', (req, res) => {
	let data = req.body;
	var games = " and (1 = 0"
	if(data.hg){
		games += " or hg = 1"
	}
	if(data.ss){
		games += " or ss = 1"
	}
	if(data.d){
		games += " or d = 1"
	}
	if(data.pe){
		games += " or pe = 1"
	}
	if(data.pt){
		games += " or pt = 1"
	}
	if(data.evo){
		games += " or evo = 1"
	}
	games += ")"

	groupby = ""
	if(data.selector == "1"){
		groupby = " group by dex"
	}
	limit = "50"
	if(data.limit != ""){
		limit = data.limit
	}

	filtro = ""
	if(isNaN(data.poke)){
		filtro = " and name like '" + data.poke + "%'";
	}else if(data.poke != ""){
		filtro = " and dex >= " + data.poke;
	}

	let sql = 'select * from alldata where 1 = 1' + filtro + games + groupby + ' order by dex limit ' + limit;
	let rows = db.prepare(sql).all({games:games});
	res.json(rows);
})

app.get('/login', (req, res) => {
	res.render('login', {error: false});
})

app.post('/login', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	if(username && password){
		let row = db.prepare('select * from users where username = ?').get(username);
		if(row === undefined){
			res.render('login', {error: true});
		}else{
			var db_password = row.password
			bcrypt.compare(password, db_password, (err, result) => {
				if(result){
					//YAY
					res.redirect('/');
				}else{
					res.render('login', {error: true});
				}
			});
		}
	}
})

app.get('/register', (req, res) => {
	res.render('register', {error: false});
})

app.post('/register', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	if(username && password && password2){
		if(password == password2){
			let row = db.prepare('select * from users where username = ?').get(username);
			if(row === undefined){
				bcrypt.hash(password, saltRounds, (err, hash) => {
					db.prepare('insert into users (username, password) values (?,?)').run(username, hash);
				})
				res.render('index');
			}else{
				res.render('register', {error: true, msg:"Username " + username + " is already taken."});
			}
		}else{
			res.render('register', {error: true, msg:"Passwords doesn't match."});
		}
	}else{
		res.render('register', {error:true, msg:"Please, select an username and a password to register."})
	}
})


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})