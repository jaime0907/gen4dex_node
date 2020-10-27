const express = require('express')
const path = require('path');
const Database = require('better-sqlite3');
const session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nunjucks = require('nunjucks');

const app = express()
const port = process.env.PORT || 3000;

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

app.use(session({
	store: new SQLiteStore,
	secret: 'Es un secreto!',
	resave: false,
	saveUninitialized: true
}))


app.get('/', (req, res) => {
	//res.sendFile(path.join(__dirname + '/html/index.html'));
	let islogged = false
	if(req.session.username){
		islogged = true
	}
	res.render('index', {islogged: islogged, username: req.session.username})
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
	if(data.egg){
		games += " or egg = 1"
	}
	if(data.event){
		games += " or event = 1"
	}
	games += ")"

	method = " and (1 = 0"
	if(data.wild){
		method += " or method = 'Grass' or method = 'Cave' or method = 'Super Rod' or method = 'Surf' or method = 'Good Rod' or method = 'OldRod' or method = 'Building' "
	}
	if(data.headbutt){
		method += " or method = 'Headbutt'"
	}
	if(data.hoenn){
		method += " or method = 'Hoenn Sound'"
	}
	if(data.sinnoh){
		method += " or method = 'Sinnoh Sound'"
	}
	if(data.radar){
		method += " or method = 'Poké Radar'"
	}
	if(data.swarm){
		method += " or method = 'Swarm'"
	}
	if(data.slot){
		method += " or method = 'E' or method = 'S' or method = 'R' or method = 'FR' or method = 'LG' or method = 'FRLGE' or method = 'Any'"
	}
	if(data.other){
		method += " or (method like '%' and method != 'E' and method != 'S' and method != 'R' and method != 'FR' and method != 'LG' and method != 'FRLGE' and method != 'Any' and method != 'Swarm'  and method != 'Poké Radar' and method != 'Sinnoh Sound' and method != 'Hoenn Sound' and method != 'Headbutt' and method != 'Grass' and method != 'Cave' and method != 'Super Rod' and method != 'Surf' and method != 'Good Rod' and method != 'OldRod' and method != 'Building' )"
	}
	method += ")"


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

	var catched = ""
	if(req.session.username){
		let rowdex = db.prepare('select * from users where username = ?').get(req.session.username);
		pokedex = rowdex.pokedex;
		for(let i = 0; i < 493; i++){
			if(pokedex && i < pokedex.length && pokedex[i] == "1"){
				var dex = i + 1;
				catched += " and dex != " + dex;
			}
		}
	}

	let sql = 'select * from (select *, max(coalesce(probdawn,0), coalesce(probday,0), coalesce(probnight,0)) as maxprob from alldata where 1 = 1' + filtro + catched + games + method + ' order by dex, maxprob desc) ' + groupby + " limit " + limit;
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
					req.session.regenerate(function(err){
						req.session.username = username;
						res.redirect('/');
					})
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
					var emptydex = ""
					for(let i = 0; i < 493; i++){
						emptydex += "0"
					}
					db.prepare('insert into users (username, password, pokedex) values (?,?,?)').run(username, hash, emptydex);
					req.session.regenerate(function(err){
						req.session.username = username;
						res.redirect('/');
					})
				})
				
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

app.get('/logout', (req,res) => {
	req.session.destroy(function(err){
		res.redirect('/')
	})
})

function getPokesProfile(db, username){
	var pokes = []
	var row = db.prepare('select * from users where username = ?').get(username);
	for(let i = 0; i < 493; i++){
		if(i % 5 == 0){
			pokes.push([])
		}
		var capt = 0;
		if(row.pokedex && i < row.pokedex.length){
			capt = row.pokedex[i]
		}
		var dex = i + 1;
		var zerodex = ('000' + dex).slice(-3);
		p = {catch:capt, dex: dex, zerodex: zerodex};
		pokes[pokes.length - 1].push(p);
	}
	return pokes;
}

app.get('/profile', (req, res) => {
	var pokes = getPokesProfile(db, req.session.username);
	res.render('profile', {username: req.session.username, pokes: pokes});
})

app.post('/profile', (req, res) => {
	var pokes = getPokesProfile(db, req.session.username);
	var text = req.body.poketext;
	pokedex = ""
	if(text){
		for(let i = 0; i < 493; i++){
			if(i < text.length){
				if(text[i] == "0" || text[i] == "1"){
					pokedex += text[i];
				}else{
					res.render('profile', {username: req.session.username, pokes: pokes, msg: "Text Pokédex must consist of only ones (1) and zeros (0)."});
					return;
				}
			}else{
				pokedex += '0';
			}
		}
		db.prepare('update users set pokedex = ? where username = ?').run(pokedex, req.session.username);
		var pokes = getPokesProfile(db, req.session.username);
		res.render('profile', {username: req.session.username, pokes: pokes});
	}else{
		res.render('profile', {username: req.session.username, pokes: pokes, msg: "Please insert some data into the text Pokédex."});
	}
	
})

app.post('/catchpoke', (req,res) => {
	var dex = req.body.dex;
	var username = req.session.username;
	
	var row = db.prepare('select * from users where username = ?').get(username);
	var pokedex = row.pokedex;
	var newdex = pokedex.substr(0, dex-1) + "1" + pokedex.substr(dex);
	db.prepare('update users set pokedex = ? where username = ?').run(newdex, username);
	res.sendStatus(200);
})

app.post('/uncatchpoke', (req,res) => {
	var dex = req.body.dex;
	var username = req.session.username;
	
	var row = db.prepare('select * from users where username = ?').get(username);
	var pokedex = row.pokedex;
	var newdex = pokedex.substr(0, dex-1) + "0" + pokedex.substr(dex);
	db.prepare('update users set pokedex = ? where username = ?').run(newdex, username);
	res.sendStatus(200);
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})