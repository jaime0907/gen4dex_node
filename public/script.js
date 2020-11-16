
var franjahoraria = 0;


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

function getSprite(classname){
	return '<div class="bg-' + classname.replaceAll(" ", "_") + '" style="vertical-align:middle; display:inline-block; margin: 0px 4px;"></div>';
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
	if(poke.subloc == "greyed"){
		name.classList.add('greyed');
	}

	var place = row.insertCell(2);
	var lang = document.getElementById("hiddenlang").innerHTML;
	if(lang == "es"){
		place.innerHTML = poke.place_esp;
	}else{
		place.innerHTML = poke.place;
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
	}else if(poke.egg == 1){
		game.innerHTML = document.getElementById('gameegglabel').innerHTML;
		game.style.background = "#e8e0a0";
		game.style.color = "black"
	}else if(poke.event == 1){
		game.innerHTML = document.getElementById('gameeventlabel').innerHTML;
		game.style.background = "#5bf7ef";
		game.style.color = "black"
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
			game.style.background = "linear-gradient(to bottom right, #041e7d 49.5%, #6f047d 50.5%)";
			game.style.color = "white";
			break;
		case "DPPt":
			game.style.background = "linear-gradient(to bottom right, #041e7d 33.3%, #6f047d 33.4%, #6f047d 66.6%, #4a0000 66.7%)";
			game.style.color = "white";
			break;
		case "PPt":
			game.style.background = "linear-gradient(to bottom right, #6f047d 49.5%, #4a0000 50.5%)";
			game.style.color = "white";
			break;
	}

	var methodrow = row.insertCell(4);
	var method = document.createElement('div');
	method.className = 'outer';
	methodrow.appendChild(method)
	method_ori = poke.method
	subloc_ori = poke.subloc
	if(lang == "es"){
		poke.method = poke.method_esp;
		poke.subloc = poke.subloc_esp;
	}
	method.innerHTML = getSprite(method_ori) + ' ' + poke.method
	if(method_ori == "R" || method_ori == "S" || method_ori == "FR" || method_ori == "LG" || method_ori == "E" || method_ori == "FRLGE" || method_ori == "Any"){
		method.innerHTML = getSprite(method_ori) + ' Slot 2';
	}
	if(method_ori == "Stone"){
		//method.innerHTML = '<img src=\"stones/' + poke.subloc + '.png\" style="vertical-align:middle"> ' + poke.subloc;
		method.innerHTML = getSprite(subloc_ori) + ' ' + poke.subloc;
	}
	if(method_ori == "Hatching"){
		method.innerHTML = getSprite("Egg")
		if(subloc_ori != ""){
			if(subloc_ori == "EggM"){
				method.innerHTML = getSprite("EggM") + poke.method;
			}else{
				method.innerHTML += getSprite(subloc_ori) + poke.method;
			}
		}else{
			method.innerHTML += poke.method
		}
	}
	if(method_ori == "Mr. Backlot"){
		method.innerHTML = getSprite("Backlot") + poke.subloc
	}
	if(method_ori == "Starter"){
		method.innerHTML = getSprite("Gift") + poke.method
	}
	if(method_ori == "Trade" && subloc_ori != ""){
		method.innerHTML = getSprite("Trade") + getSprite(subloc_ori.replace("'", "")) + poke.method;
	}
	if(method_ori == "One level"){
		if(subloc_ori != ""){
			method.innerHTML = getSprite(subloc_ori) + poke.method
		}else{
			method.innerHTML = getSprite("Level") + poke.method
		}
	}
	if(method_ori == "In-game trade"){
		method.innerHTML = getSprite(subloc_ori) + '<div class=\"sprite sprite-' + FormatNumberLength(poke.specialprob, 3) + 'MS\" style="vertical-align:middle"></div>' + poke.method
	}
	if(method_ori == "Event" && subloc_ori != ""){
		method.innerHTML = getSprite(subloc_ori) + poke.method
	}
	if(method_ori == "Fossil" && subloc_ori != ""){
		method.innerHTML = getSprite(subloc_ori) + poke.subloc
	}
	

	var level = row.insertCell(5);
	if(poke.levelmax == poke.levelmin){
		if(poke.levelmax >= 0){
			level.innerHTML = poke.levelmax;
		}
	}else{
		level.innerHTML = poke.levelmin + '-' + poke.levelmax;
	}

	var prob1 = row.insertCell(6);
	if(poke.probdawn <= 0 || poke.probdawn > 100){
		prob1.innerHTML = '';
	}else{
		prob1.innerHTML = poke.probdawn + '%';
	}

	var prob2 = row.insertCell(7);
	if(poke.probday <= 0 || poke.probday > 100){
		prob2.innerHTML = '';
	}else{
		prob2.innerHTML = poke.probday + '%';
	}

	var prob3 = row.insertCell(8);
	if(poke.probnight <= 0 || poke.probnight > 100){
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

	if(poke.subloc == "greyed"){
		row.style.backgroundColor = "#a0a0a0"
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
	getHora();
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
		egg: document.getElementById("gameegg").checked,
		event: document.getElementById("gameevent").checked,
		limit: document.getElementById("limit").value,
		selector: document.getElementById("groupselector").value,
		wild: document.getElementById("method-wild").checked,
		headbutt: document.getElementById("method-headbutt").checked,
		slot: document.getElementById("method-slot").checked,
		hoenn: document.getElementById("method-hoenn").checked,
		sinnoh: document.getElementById("method-sinnoh").checked,
		radar: document.getElementById("method-radar").checked,
		swarm: document.getElementById("method-swarm").checked,
		other: document.getElementById("method-other").checked
	}));
}



function startScripts(){
	var selector = document.getElementById("groupselector").value;
	if(selector == 1){
		mostProbable(false);
	}else{
		allLocations(false);
	}
	var limit = document.getElementById("limit").value;
	if(limit == 10){
		limit10(false);
	}else if(limit == 100){
		limit100(false);
	}else{
		limit50(false);
	}
	setInterval(getHora, 5*1000);

	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var data = JSON.parse(xhr.responseText); // Returned data, e.g., an HTML document.
		console.log(data)
		if(data.islogged){
			var sel = data.data;
			document.getElementById("gamehg").checked = sel.hg
			document.getElementById("gamess").checked = sel.ss
			document.getElementById("gamed").checked = sel.d
			document.getElementById("gamepe").checked = sel.pe
			document.getElementById("gamept").checked = sel.pt
			document.getElementById("gameevo").checked = sel.evo
			document.getElementById("gameegg").checked = sel.egg
			document.getElementById("gameevent").checked = sel.event

			document.getElementById("method-wild").checked = sel.wild
			document.getElementById("method-headbutt").checked = sel.headbutt
			document.getElementById("method-slot").checked = sel.slot
			document.getElementById("method-hoenn").checked = sel.hoenn
			document.getElementById("method-sinnoh").checked = sel.sinnoh
			document.getElementById("method-radar").checked = sel.radar
			document.getElementById("method-swarm").checked = sel.swarm
			document.getElementById("method-other").checked = sel.other
		}
		
		getPoke();
	}

	xhr.open("POST", "/selectorinfo", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	xhr.send();
}

window.onload = startScripts();
