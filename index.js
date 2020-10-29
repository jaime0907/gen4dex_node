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

var lang_dict = {
	es: require('./lang_es.json'),
	en: require('./lang_en.json')
}

app.engine('html', nunjucks.render)
app.set('view engine', 'html');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const db = new Database('gen4dex_db.sqlite3');
const db_users = new Database('users_db.sqlite3');

app.use(express.static('public'));

app.use(session({
	store: new SQLiteStore,
	secret: 'Es un secreto!',
	resave: false,
	saveUninitialized: true
}))


app.get('/', (req, res) => {
	
	var lang = 'en'
	if(!req.session){
		req.session.regenerate(function(err){
		})
	}else{
		if(req.session.lang){
			lang = req.session.lang;
		}
	}

	if(req.query.lang){
		lang = req.query.lang
		req.session.lang = req.query.lang
	}

	let islogged = false
	if(req.session.username){
		islogged = true
	}
	res.render('index', {islogged: islogged, username: req.session.username, l: lang_dict[lang]})
})

app.post('/selectorinfo', (req,res) => {
	var username = req.session.username;
	if(username){
		var row = db_users.prepare('select hg, ss, d, pe, pt, evo, egg, event, wild, headbutt, hoenn, sinnoh, radar, swarm, slot, other from users where username = ?').get(username)
		res.json({islogged: true, data: row})
	}else{
		res.json({islogged: false})
	}
	
	
})

app.post('/post', (req, res) => {
	let data = req.body;

	var username = req.session.username;
	if(username){
		let sql = db_users.prepare('update users set hg = ' + data.hg + ', ss = ' + data.ss + ', d = ' + data.d + ', pe = ' + data.pe + ', pt = ' + data.pt + ', evo = ' + data.evo + ', egg = ' + data.egg + ', event = ' + data.event + ', wild = ' + data.wild + ', headbutt = ' + data.headbutt + ', hoenn = ' + data.hoenn + ', sinnoh = ' + data.sinnoh + ', radar = ' + data.radar + ', swarm = ' + data.swarm + ', slot = ' + data.slot + ', other = ' + data.other + ' where username = ?')
		sql.run(username)
	}

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
		let rowdex = db_users.prepare('select * from users where username = ?').get(req.session.username);
		pokedex = rowdex.pokedex;
		for(let i = 0; i < 493; i++){
			if(pokedex && i < pokedex.length && pokedex[i] == "1"){
				var dex = i + 1;
				catched += " and dex != " + dex;
			}
		}
	}

	let sql = 'select * from (select *, max(coalesce(probdawn,0), coalesce(probday,0), coalesce(probnight,0)) as maxprob from alldata inner join esp on alldata.id = esp.id where 1 = 1' + filtro + catched + games + method + ' order by dex, maxprob desc) ' + groupby + " limit " + limit;
	let rows = db.prepare(sql).all({games:games});

	res.json(rows);
})

app.get('/login', (req, res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	res.render('login', {error: false, l: lang_dict[lang]});
})

app.post('/login', (req, res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	var username = req.body.username;
	var password = req.body.password;
	if(username && password){
		let row = db_users.prepare('select * from users where username = ?').get(username);
		if(row === undefined){
			res.render('login', {error: true, l: lang_dict[lang]});
		}else{
			var db_password = row.password
			bcrypt.compare(password, db_password, (err, result) => {
				if(result){
					if(req.session){
						req.session.username = username;
						res.redirect('/');
					}else{
						req.session.regenerate(function(err){
							req.session.username = username;
							res.redirect('/');
						})
					}
				}else{
					res.render('login', {error: true, l: lang_dict[lang]});
				}
			});
		}
	}
})

app.get('/register', (req, res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	res.render('register', {error: false, l: lang_dict[lang]});
})

app.post('/register', (req, res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	if(username && password && password2){
		if(password == password2){
			let row = db_users.prepare('select * from users where username = ?').get(username);
			if(row === undefined){
				bcrypt.hash(password, saltRounds, (err, hash) => {
					var emptydex = ""
					for(let i = 0; i < 493; i++){
						emptydex += "0"
					}
					db_users.prepare('insert into users (username, password, pokedex) values (?,?,?)').run(username, hash, emptydex);
					req.session.regenerate(function(err){
						req.session.username = username;
						res.redirect('/');
					})
				})
				
			}else{
				res.render('register', {error: true, msg:lang_dict[lang].username_taken_1 + username + lang_dict[lang].username_taken_2, l: lang_dict[lang]});
			}
		}else{
			res.render('register', {error: true, msg:lang_dict[lang].password_no_match, l: lang_dict[lang]});
		}
	}else{
		res.render('register', {error:true, msg:lang_dict[lang].no_username_password, l: lang_dict[lang]})
	}
})

app.get('/logout', (req,res) => {
	delete req.session.username
	res.redirect('/')
})

function getPokesProfile(db, username){
	var pokes = []
	var row = db_users.prepare('select * from users where username = ?').get(username);
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
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	var pokes = getPokesProfile(db, req.session.username);
	res.render('profile', {username: req.session.username, pokes: pokes, l: lang_dict[lang]});
})

app.post('/profile', (req, res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	var pokes = getPokesProfile(db, req.session.username);
	var text = req.body.poketext;
	pokedex = ""
	if(text){
		for(let i = 0; i < 493; i++){
			if(i < text.length){
				if(text[i] == "0" || text[i] == "1"){
					pokedex += text[i];
				}else{
					res.render('profile', {username: req.session.username, pokes: pokes, msg: lang_dict[lang].pokedex_ones_zeros, l: lang_dict[lang]});
					return;
				}
			}else{
				pokedex += '0';
			}
		}
		db_users.prepare('update users set pokedex = ? where username = ?').run(pokedex, req.session.username);
		var pokes = getPokesProfile(db, req.session.username);
		res.render('profile', {username: req.session.username, pokes: pokes, l: lang_dict[lang]});
	}else{
		res.render('profile', {username: req.session.username, pokes: pokes, msg: lang_dict[lang].pokedex_no_data, l: lang_dict[lang]});
	}
	
})

app.post('/catchpoke', (req,res) => {
	var dex = req.body.dex;
	var username = req.session.username;
	if(username){
		var row = db_users.prepare('select * from users where username = ?').get(username);
		var pokedex = row.pokedex;
		var newdex = pokedex.substr(0, dex-1) + "1" + pokedex.substr(dex);
		db_users.prepare('update users set pokedex = ? where username = ?').run(newdex, username);
	}
	res.sendStatus(200);
})

app.post('/uncatchpoke', (req,res) => {
	var dex = req.body.dex;
	var username = req.session.username;
	
	var row = db_users.prepare('select * from users where username = ?').get(username);
	var pokedex = row.pokedex;
	var newdex = pokedex.substr(0, dex-1) + "0" + pokedex.substr(dex);
	db_users.prepare('update users set pokedex = ? where username = ?').run(newdex, username);
	res.sendStatus(200);
})

app.get('/help', (req, res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	res.render('help',{l: lang_dict[lang]});
})

app.get('*', (req,res) => {
	var lang = 'en'
	if(req.session.lang){
		lang = req.session.lang;
	}
	res.status(404).render('errorpage',{l: lang_dict[lang]})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})