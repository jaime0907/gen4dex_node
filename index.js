const express = require('express')
const path = require('path');
const Database = require('better-sqlite3');


const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json());


const db = new Database('gen4dex_db.sqlite3', { verbose: console.log });

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/html/index.html'));
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

	console.log(data);

	let sql = 'select * from alldata where 1 = 1' + games + groupby + ' order by dex limit ' + limit;
	let rows = db.prepare(sql).all({games:games});
	res.json(rows);
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})