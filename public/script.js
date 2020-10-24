
var franjahoraria = 0;

function getHora(){
	var d = new Date();
	var d2 = new Date();
	var h = d.getHours();
	var ht = '';
	if(h >= 4 && h < 10){
		ht = 'Morning';
		franjahoraria = 0;
		d2.setHours(10);
		d2.setMinutes(0);
		d2.setSeconds(0);
	}else if(h >= 10 && h < 20){
		ht = 'Day';
		franjahoraria = 1;
		d2.setHours(20);
		d2.setMinutes(0);
		d2.setSeconds(0);
	}else{
		ht = 'Night';
		franjahoraria = 2;
		if(h > 5){
			d2.setDate(d2.getDate() + 1);
		}
		d2.setHours(4);
		d2.setMinutes(0);
		d2.setSeconds(0);
	}
	var hours = (d2-d)/1000/60/60;
	var min = (hours - Math.floor(hours)) * 60;
	var hourst = Math.floor(hours);
	var mint = Math.floor(min);

	var plural = 1;
	var remain = '';
	if(hourst == 1)
	{
		remain += hourst + ' hour';
		plural = 0;
	}else if(hourst != 0)
	{
		remain += hourst + ' hours';
		plural = 1;
	}

	if(hourst != 0) remain += ' and ';
	if(mint == 1)
	{
		remain += mint + ' minute';
		plural = 0;
	}else if(mint != 0)
	{
		remain += mint + ' minutes';
		plural = 1;
	}
	remain += ' until ';
	if(ht == "Morning"){
		remain += 'Day';
	}else if(ht == "Day"){
		remain += 'Night';
	}else{
		remain += 'Morning';
	}
	remain += ')';
	document.getElementById("demo").innerHTML = 'Current time: ' + FormatNumberLength(d.getHours(), 2) + ':' + FormatNumberLength(d.getMinutes(), 2) + ' ('+ ht + ', ' + remain;
}

function catchPoke(dex){
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
			getPoke();
	};
	xhr.open("POST", "/catchpoke", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	xhr.send(JSON.stringify({
		dex: dex
	}));
}

function addRow(){
	var table = document.getElementById("tablepoke");
	var rows = 1;
	var cols = 3;
	var row = table.insertRow(0);
	for(var c = 0; c < cols; c++)
	{
		var cel = row.insertCell(c);
		cel.innerHTML = c;
	}
}

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function addRowPoke(poke, lastpoke){
	var table = document.getElementById("tablepoke");
	var rows = 1;
	var cols = 3;
	var row = table.insertRow(table.rows.length);

	var dex = row.insertCell(0);
	dex.innerHTML = FormatNumberLength(poke.dex, 3);

	var name = row.insertCell(1);
	/*name.innerHTML = '<img src=\"static/pokes/' + FormatNumberLength(poke.dex, 3) + 'MS.png\" style="vertical-align:middle"> ' + poke.name;*/
	name.innerHTML = '<div class=\"sprite sprite-' + FormatNumberLength(poke.dex, 3) + 'MS\" style="vertical-align:middle"></div> ' + poke.name;
	name.style.textAlign = "left";
	name.style.cursor = "pointer";
	name.onmouseover = function(){
		this.style.background = "#e3a90b";
	}
	name.onmouseleave = function(){
		this.style.background = '';
	}
	name.onclick = function(){catchPoke(poke.dex)};

	var place = row.insertCell(2);
	place.innerHTML = poke.place;
	if(poke.method == "Stone"){
		place.innerHTML += ' <img src=\"stones/' + poke.subloc + '.png\" style="vertical-align:middle">'
	}

	var game = row.insertCell(3);
	game.innerHTML = '';
	if(poke.hg == 1 && poke.ss == 1){
		game.innerHTML = 'HGSS';
		game.style.background = "linear-gradient(to bottom right, #f2ae00 49.5%, #a6a6a6 50.5%)";
	}else if(poke.hg == 1){
		game.innerHTML = 'HG';
		game.style.background = "#f2ae00";
	}else if(poke.ss == 1){
		game.innerHTML = 'SS';
		game.style.background = "#a6a6a6";
	}else if(poke.evo == 1){
		game.innerHTML = 'Evo';
		game.style.background = "#239641";
		game.style.color = "white"
	}
	if(poke.d == 1){
		game.innerHTML = game.innerHTML.concat('D');
	}
	if(poke.pe == 1){
		game.innerHTML = game.innerHTML.concat('P');
	}
	if(poke.pt == 1){
		game.innerHTML = game.innerHTML.concat('Pt');
	}
	switch(game.innerHTML){
		case "D":
			game.style.background = "#041e7d";
			game.style.color = "white";
			break;
		case "P":
			game.style.background = "#6f047d";
			game.style.color = "white";
			break;
		case "Pt":
			game.style.background = "#4a0000";
			game.style.color = "white";
			break;
		case "DP":
		case "DPPt":
			game.style.background = "linear-gradient(to bottom right, #041e7d 49.5%, #6f047d 50.5%)";
			game.style.color = "white";
			break;
	}

	var method = row.insertCell(4);
	method.innerHTML = poke.method;
	if(poke.method == "R" || poke.method == "S" || poke.method == "FR" || poke.method == "LG" || poke.method == "E" || poke.method == "FRLGE" || poke.method == "Any"){
		method.innerHTML = ' <img src=\"gba/' + poke.method + '.png\" style="vertical-align:middle"> Slot 2'
	}

	var level = row.insertCell(5);
	if(poke.levelmax == poke.levelmin){
		level.innerHTML = poke.levelmax;
	}else{
		level.innerHTML = poke.levelmin + '-' + poke.levelmax;
	}

	var prob1 = row.insertCell(6);
	if(poke.probdawn <= 0){
		prob1.innerHTML = '';
	}else{
		prob1.innerHTML = poke.probdawn + '%';
	}

	var prob2 = row.insertCell(7);
	if(poke.probday <= 0){
		prob2.innerHTML = '';
	}else{
		prob2.innerHTML = poke.probday + '%';
	}

	var prob3 = row.insertCell(8);
	if(poke.probnight <= 0){
		prob3.innerHTML = '';
	}else{
		prob3.innerHTML = poke.probnight + '%';
	}

	switch(franjahoraria){
		case 0:
			prob1.style.backgroundColor = "#ffe8fd"
			break;
		case 1:
			prob2.style.backgroundColor = "#ffe8fd"
			break;
		case 2:
			prob3.style.backgroundColor = "#ffe8fd"
			break;
		default:
			break;
	}

	if(poke.dex != lastpoke && document.getElementById("groupselector").value == 0){
		row.style.backgroundColor = "#ffeec4"
	}

}
function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie != '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
           var cookie = jQuery.trim(cookies[i]);
           // Does this cookie string begin with the name we want?
           if (cookie.substring(0, name.length + 1) == (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
	 return cookieValue;
}
function getPoke(){
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var lastpoke = 0;
		var status = xhr.status; // HTTP response status, e.g., 200 for "200 OK"
		var data = JSON.parse(xhr.responseText); // Returned data, e.g., an HTML document.
		var table = document.getElementById("tablepoke");
		for(var j=table.rows.length-1;j>0;j--){
			table.deleteRow(j);
		}
		var limit = document.getElementById("limit").value;
		for(var i=0;i<data.length;i++){
			if(limit != '' && !isNaN(limit) && limit < i){
				break;
			}
			addRowPoke(data[i], lastpoke);
			lastpoke = data[i].dex;
		}
	}


	xhr.open("POST", "/post", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	xhr.send(JSON.stringify({
		poke: document.getElementById("pokename").value,
		hg: document.getElementById("gamehg").checked,
		ss: document.getElementById("gamess").checked,
		d: document.getElementById("gamed").checked,
		pe: document.getElementById("gamepe").checked,
		pt: document.getElementById("gamept").checked,
		evo: document.getElementById("gameevo").checked,
		limit: document.getElementById("limit").value,
		selector: document.getElementById("groupselector").value
	}));
}



function startScripts(){
	getHora();
	getPoke();
}

window.onload = startScripts;
