/*
This version of the CYOA was edited by KOrlong in July 2020, based on the fantastic first three versions by chinelesilklanterns in May 2020.
 
  License: You are free to use and redistribute this game, associated code and files entirely free of charge in a non-commercial setting, so long as proper attribution is given to me. 
  I do not own the copyright to the illustrated images in the 'icons' folder used in this game, they belong to various artists found online.
  You agree not to hold me responsible for any damages that may result from your use of these files, use at your own risk.
  You may create derivative works, using all or parts of the files provided here, as long as the abovementioned acknowledgement is retained.
  
*/

var playertoken = new Object();	
var cellsdata = TAFFY(configCells)().get();
var fxdata = TAFFY(configEffects);
var itemsdata = TAFFY(items);
var fxdesc = TAFFY(configAttribDescs);

var currentOptions = []; //track what options were shown to player in questions page

playertoken.inv = [];
playertoken.stats = {
"name":"",
"last name":"",
"age":18,
"height":170,
"sex":0,

"strength":0,
"stamina":0,
"dexterity":0,
"eyesight":0,
"constitution":0,
"intelligence":0,
"charisma":0,
"talent":0,
"luck":0,

"breast size":0,
"hair length":0,
"hair color":"Black",
"eye color":"Brown",
"ass size":0,
"physique":0,
"orientation":0,
"increased libido":0,
"increased sensitivity":0,
"increased fluids":0,
"always ready":0,
"enhanced orgasms":0,
"submissiveness":0,
"optimized body":0,
"multiple orgasms":0,
"random orgasms":0,
"triggered orgasms":0,
"triggered arousal":0,
"easily aroused":0,
"hair trigger":0,
"flexible":0,
"shrunken assets":0,
"tasty fluids":0,
"pheromones":0,
"no gag reflex":0,
"oral lover":0,
"anal lover":0,
"infertile":0,
"very fertile":0,
"pent up":0,
"masochistic":0,
"exhibitionist":0,
"lewd dreams":0,
"heat":0,
"polycule":0,
"fluid addiction":0,
"lactation":0,
"looks":0,
"hair removal":0,
"sleepy":0,
"noisy":0,
"denial":0,

"palette swap":0,
"name change":0
};

playertoken.currentpos = 0;
playertoken.lastrolled = 0;
playertoken.lastselecteditem = 0;

var minheight = 140;
var minage = 16;

var showtfeffect = false;
var tfcounter = 0;
var money = 0;
var issandbox = false;
var loadeddice = false;

playertoken.setpos = function(curpos) {

	playertoken.currentpos = curpos;
	console.log(curpos);
	
	var cellProp = $('td').filter(function(i,e){ return this.textContent.trim() == curpos }).get(0);
	
	var paddingX = 20;
	var paddingY = 20;
	
	var pX = ((54 * parseInt(cellProp.cellIndex)) );
	var pY = ((53.5 * parseInt(cellProp.parentNode.rowIndex)));
	
	$('#player').animate({top: pY + 'px', left: pX + 'px'},400);
	
	if(curpos == "End")
	{
		playertoken.gameover();
	}
	else if(playertoken.currentpos > 1 && playertoken.currentpos < 100)
	{		
		setTimeout(function()
		{
			setQuestion();
			
		}, 600);
	}
	else 
	{
		setTimeout(function()
		{
			document.getElementById('rolldicebtn').onclick = rolldice;
			document.getElementById('reddice').onclick = rolldice;	
			document.getElementById('invicon').onclick = showinventory;
			document.getElementById('charicon').onclick = showplayerstatus;	
			document.getElementById('shopicon').onclick = showshop;
		}, 400);		
	}
}

playertoken.gameover = function()
{	
	setTimeout(function(){
	//alert('game over');
	
	$('#finalinspect').delay(500).fadeIn(1000);
	$('#msgComplete').fadeIn();
	}, 1000);
	var prog = "";
	if(tfcounter==0)
	{
		prog = "You somehow made it through entirely unscathed. Perhaps fate has other plans...";
	}
	else if(tfcounter<=5)
	{
		prog = "You made it through nearly unchanged. Well, except for one or two things...";
	}
	else if(tfcounter<=10)
	{
		prog = "Hmm. Guess you're gonna have a couple of changes to get used to...";		
	}
	else
	{
		prog = "You've gone through many changes. Now you'll have a lifetime to rediscover yourself...";
	}
	
	
	document.getElementById('prognosis').innerHTML = prog;
	document.getElementById('tfcount').innerHTML = "Total Curses Received: " + tfcounter + " | Lifelong Monthly Cash : $" + money;
}


var nextscreen = function(oldscreen, newscreen) {
	document.getElementById(oldscreen).style.display = "none";
	document.getElementById(newscreen).style.display = "block";
	if(newscreen=='screen4')
	{
	populateboard();
	showpopup("<img src='img/welcome.jpg' width=200 height=125 style=\"border:2px solid #000000; float:middle;\" /><br/>Welcome to <span style='color:lime'><s>Jumanji</s> Cursed Boardgame</span>, the greatest (and totally original) boardgame of all time! <br/><br/>Go ahead, <span style='color:pink'>roll the dice</span>, your game token will begin moving! Reach the end and win the game to escape - you'll get to keep whatever you win!<br/><br/>Oh, what fun we're going to have!<br/><br/><span style='color:yellow'><em>\"We all make choices, but in the end, our choices make us.\"</em></span>");
	}
}

var selectedchar = function() {
	nextscreen('screen2', 'screen3');
	loadeddice = false;
	//if sandbox mode selected, handle it
	if(issandbox) //note that these ids will not exist in DOM if not in sandbox mode. let the game crash, i don't care.
	{
		playertoken.stats["name"] = document.getElementById('ifname').value;
		playertoken.stats["last name"] = document.getElementById('ilname').value;
		playertoken.stats["age"] = parseInt(document.getElementById('iage').value);	
		playertoken.stats["height"] = parseInt(document.getElementById('iheight').value);		
		playertoken.stats["hair color"] = document.getElementById('ihairc').value;
		playertoken.stats["eye color"] = document.getElementById('ieyec').value;
		playertoken.stats["orientation"] = parseInt(document.getElementById('iori').value);
		
		
		var igd = parseInt(document.getElementById('isex').value);
		playertoken.stats["sex"] = igd;
		if(igd!=0)
		{
			playertoken.stats["breast size"] = 1;
			playertoken.stats["hair length"] = 1;
			playertoken.stats["ass size"] = 1;
		}
		
		if(document.getElementById("iinfsilver").checked)
		{
			playertoken.inv = [{name:"Silver Coin", qty:999}];
		}
		if(document.getElementById("iloaddice").checked)
		{
			loadeddice = true;
		}
	}
	
	if(document.querySelector('.active'))
		document.querySelector('.active').className = "";
}

function playcurseanim()
{
	setTimeout(function(){
		document.getElementById('charicon').style.animation = "curseanim 3s";
		document.getElementById('innerself').style.animation = "curseanim2 4s";
		setTimeout(function(){
			document.getElementById('charicon').style.animation = "none";
			document.getElementById('innerself').style.animation = "none";
		},4100);
	},100);
}

function populateboard()
{
	var datstr="";
	for(var i=0;i<cellsdata.length;++i)
	{
		var cs = cellsdata[i];
		for(var j=0;j<cs.cellid.length;++j)
		{			
			var subid = cs.cellid[j]-1;
			var row = 9 - Math.floor(subid / 10);
			var col = 9 - ((subid) % 10);
			if(row % 2) //is odd
			{
				col = (subid) % 10;
			}
			var ftop = 24 + 54*row;
			var fleft = 24 + 54*col;
			datstr += "<div style='width:42px;	height:42px; top: "+ftop+"px; left: "+fleft+"px;'><img src='img/icons/"+cs.image+"' width=42 height=42 /></div>";
		}
	}
	document.getElementById('snakesDiv').innerHTML = datstr;
}

function removeDups(arrs) {

var uniqueArray = arrs.filter(function(item, pos) {
    return arrs.indexOf(item) == pos;
})
return uniqueArray;

	//return Array.from(new Set(arrs));
}

function shuffle(inarr){ //weighted shuffle
	var extras = [];
	for(var i=0;i<inarr.length;++i)
	{
		if(inarr[i].randwt!=null)
		{
			for(var j=0;j<inarr[i].randwt;++j)
			{
				extras.push(inarr[i]);
			}
		}
	}
	var o = inarr.concat(extras);
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);	
    return removeDups(o);
}

function MovePlayer(stepToMove)
{
	if(playertoken.currentpos == "Start") playertoken.currentpos = 1;
	if(playertoken.currentpos == "End") playertoken.currentpos = 100;
	playertoken.currentpos += stepToMove;
	playertoken.currentpos = playertoken.currentpos<1?1:playertoken.currentpos;
	playertoken.currentpos = playertoken.currentpos>100?100:playertoken.currentpos;
	var tempholder;		
	if(playertoken.currentpos <= 1)		tempholder = "Start";
	else if(playertoken.currentpos >= 100)	tempholder = "End";
	else tempholder = playertoken.currentpos;		
	playertoken.setpos(tempholder);	
}

var rolldice = function()
{
	document.getElementById('rolldicebtn').onclick = "";	//remove click from the roll btn
	document.getElementById('reddice').onclick = "";	//remove click from the roll btn
	document.getElementById('invicon').onclick = "";
	document.getElementById('charicon').onclick = "";
	document.getElementById('shopicon').onclick = "";
	
	var randomNum;
	
	randomNum = Math.floor(Math.random() * 6) + 1;
	if(loadeddice)
	{
		randomNum = 1;
	}
	//randomNum = 199;//((playertoken.currentpos == "Start")?1:0);
	
	console.log('dice rolled: ' + randomNum);
	document.getElementsByClassName('dice')[0].className = "dice digit" + randomNum;
	setTimeout(function()
	{
		document.getElementsByClassName('dice')[0].className += "static";
		playertoken.lastrolled = randomNum;		
		MovePlayer(randomNum);		
	}, 1000);
}

function filterunwanteditems(arr)
{
	var newarr = [];
	for(var i=0;i<arr.length;++i)
	{
		if(!arr[i].stacks && qtyitem(arr[i].name))
		{			
			//player already has this item
		}
		else
		{
			newarr.push(arr[i]);
		}
	}
	return newarr
}

function filterunwantedtf(arr)
{
	var newarr = [];
	for(var i=0;i<arr.length;++i)
	{
		if(arr[i].requiresattribcustom)
		{
			//apply custom filtering for age.
			if(arr[i].requiresattribcustom=="age" && playertoken.stats["age"]<=minage)
			{				
			}
			//filter height
			else if(arr[i].requiresattribcustom=="height" && playertoken.stats["height"]<=minheight)
			{				
			}
			//filter for shrunken assets
			else if(arr[i].requiresattribcustom=="breast size" && playertoken.stats["height"]<=3)
			{				
			}
			//custom filtering for infertile and very fertile
			else if((arr[i].requiresattribcustom=="infertile" || arr[i].requiresattribcustom=="very fertile") && (playertoken.stats["infertile"]>0||playertoken.stats["very fertile"]>0))
			{				
			}
			else
			{
				newarr.push(arr[i]);
			}
		}
		else if(!arr[i].requiresattribnotmax && !arr[i].requiresattribnotmin)
		{			
			newarr.push(arr[i]);
		}
		else
		{	
			if(arr[i].requiresattribnotmax && !arr[i].requiresattribnotmin)
			{
				var limit = get_attrib_limit(arr[i].requiresattribnotmax);
				if(playertoken.stats[arr[i].requiresattribnotmax]<limit)
				{
					newarr.push(arr[i]);
				}
			}
			else if(arr[i].requiresattribnotmin && !arr[i].requiresattribnotmax)
			{				
				if(playertoken.stats[arr[i].requiresattribnotmin]>0)
				{
					newarr.push(arr[i]);
				}
			}
			else if(arr[i].requiresattribnotmin && arr[i].requiresattribnotmax)
			{
				var limit = get_attrib_limit(arr[i].requiresattribnotmax);
				if(playertoken.stats[arr[i].requiresattribnotmin]>0 && playertoken.stats[arr[i].requiresattribnotmax]<limit)
				{
					newarr.push(arr[i]);
				}
			}			
		}
	}
	return newarr
}

var setQuestion = function(fixeddata)
{
	var currcelldata = null;
	
	if(fixeddata)
	{
		currcelldata = fixeddata;
	}
	else
	{
		var cl = cellsdata.length;
		for(var i=0;i<cl;++i)
		{
			if(cellsdata[i].cellid.indexOf(playertoken.currentpos)!=-1)
			{
				currcelldata = cellsdata[i];
				break;
			}
		}
	}

	if(currcelldata)
	{
		//insert information for q/a
		var qt = "";
		if(currcelldata.imagebig)
		{
			qt += "<img src='img/icons/"+currcelldata.imagebig+"' width=140 height=140 style=\"border:2px solid #000000; margin:6px; float: right;\" />";
		}
		qt += "<u>"+currcelldata.title + "</u><br/>"+ currcelldata.prompt;
		
		currentOptions = [];
		if(currcelldata.category=="Transformation")
		{
			currentOptions = shuffle(filterunwantedtf(fxdata({category:currcelldata.category}).get())).slice(0,currcelldata.numans);
			currentOptions.push({category: "Transformation", effectname: "Choose Silver", img:"silvercoin.png", desc: "<span style='color:yellow'><em>\"When nothing you see quite fits your plate, sometimes it's better just to wait.\"</em></span><br/><br/><span style='float:right'>You make a choice... to choose nothing.<br/><br/>As soon as you make this decision, the words vanish. Instead, a single silver coin materializes and clatters at your feet, and you pick it up.<br/><br/><span style='color:lime'>Silver Coin Obtained!</span></span>"});
		}
		else if(currcelldata.category=="CursedTransformation")
		{
			currentOptions = shuffle(filterunwantedtf(fxdata({category:currcelldata.category}).get())).slice(0,currcelldata.numans);
			if(currentOptions.length==0)
			{
				currentOptions.push({category: "CursedTransformation", effectname: "Carry On", img:"nothing.jpg", desc: "<span style='color:yellow'><em>\"...........\"</em></span><br/><br/><span style='float:right'>You brace yourself and wait... but nothing happens. It seems that whatever strange magic was here has already dissipated.</span>"});
			}
			var qtyglyph = qtyitem("Glyph of Protection");
			if(qtyglyph)
			{
				currentOptions.push({category: "CursedTransformation", effectname: "Activate Glyph of Protection",  subtitle: (qtyglyph+" Remaining"), img:"none", value: 0});
			}
		}
		else if(currcelldata.category=="Teleport")
		{
			var steps1 = Math.floor(Math.random() * 3) + 2;
			var steps2 = Math.floor(Math.random() * 3) + 5;
			currentOptions.push({category: "Teleport", effectname: "Stay Put", img:"none", value: 0});
			currentOptions.push({category: "Teleport", effectname: ("Short Jump"), subtitle: ("Advance "+steps1+" squares"), img:"none", value: steps1});
			currentOptions.push({category: "Teleport", effectname: ("Long Jump"), subtitle: ("Advance "+steps2+" squares"), img:"none", value: steps2});
		}
		else if(currcelldata.category=="CursedTeleport")
		{
			var steps1 = Math.floor(Math.random() * 6) + 7;
			currentOptions = shuffle(filterunwantedtf(fxdata({category:"CursedTransformation"}).get())).slice(0,1);
			if(currentOptions.length==0)
			{
				currentOptions.push({category: "CursedTeleport", effectname: "Stay Put", img:"none", value: 0});
			}
			else
			{
				currentOptions[0].overridetitle = "Pay The Price";
				currentOptions[0].subtitle = "Gain: "+currentOptions[0].effectname;
			}
			currentOptions.push({category: "CursedTeleport", effectname: ("Decline"), subtitle: ("Retreat "+steps1+" squares"), img:"none", value: (-steps1)});
			var qtyglyph = qtyitem("Glyph of Protection");
			if(qtyglyph)
			{
				currentOptions.push({category: "WildMagic", effectname: "Activate Glyph of Protection",  subtitle: (qtyglyph+" Remaining"), img:"none", value: 0});
			}
		}
		else if(currcelldata.category=="TreasureChest")
		{			
			currentOptions.push({category: "TreasureChest", effectname: "Open Chest", img:"none", value: 0});
			currentOptions.push({category: "TreasureChest", effectname: "Ignore Chest", img:"none", value: 0});		
			var qtyglyph = qtyitem("Glyph of Unlocking");
			if(qtyglyph)
			{
				currentOptions.push({category: "TreasureChest", effectname: "Activate Glyph of Unlocking",  subtitle:(qtyglyph+" Remaining"), img:"none", value: 0});
			}
		}
		else if(currcelldata.category=="WildMagic")
		{			
			currentOptions = shuffle(filterunwantedtf(fxdata({category:"CursedTransformation"}).get())).slice(0,1);
			if(currentOptions.length==0)
			{
				currentOptions.push({category: "WildMagic", effectname: "Stay Put", img:"none", value: 0});
			}
			else
			{
				currentOptions[0].overridetitle = "Accept Fate";
				currentOptions[0].subtitle = "Gain: "+currentOptions[0].effectname;
			}
			var qtyglyph = qtyitem("Glyph of Protection");
			if(qtyglyph)
			{
				currentOptions.push({category: "WildMagic", effectname: "Activate Glyph of Protection",  subtitle:(qtyglyph+" Remaining"), img:"none", value: 0});
			}
		}
		else if(currcelldata.category=="ItemShop")
		{				
			var mycoins = qtyitem("Silver Coin");
			if(mycoins>=3)
			{
				currentOptions.push({category: "ItemShop", effectname: "Glyph of Protection", subtitle:"Costs 3 Silver Coins", img:"none", value: 3});
			}
			if(mycoins>=2)
			{
				currentOptions.push({category: "ItemShop", effectname: "Glyph of Jaunting", subtitle:"Costs 2 Silver Coins", img:"none", value: 2});
			}
			if(mycoins>=1)
			{
				currentOptions.push({category: "ItemShop", effectname: "Glyph of Unlocking", subtitle:"Costs 1 Silver Coin", img:"none", value: 1});
			}
			currentOptions.push({category: "ItemShop", effectname: "Buy Nothing", img:"none", value: 0});
			qt += "<br/><br/><b>Silver Coins: " + mycoins+"</b>";
		}
		else
		{
			console.log("Error, cannot find category");
		}
		
		document.getElementById('questionTitleTxt').innerHTML = qt;
		
		for(var i=0; i<4; i++)
		{
			if(currentOptions[i])
			{
				document.querySelectorAll('#userAnswer ul li')[i].style.display = "flex";
				var fxcatstr = "";
				if(currentOptions[i].overridetitle && currentOptions[i].overridetitle!="")
				{
					fxcatstr = currentOptions[i].overridetitle;
				}
				else
				{
					fxcatstr = currentOptions[i].effectname;
				}
				
				if(currentOptions[i].subtitle && currentOptions[i].subtitle!="")
				{
					fxcatstr += "<br/>(" + currentOptions[i].subtitle+")";
				}
				document.querySelectorAll('#userAnswer ul li')[i].innerHTML = fxcatstr;
				
				//must clear the override title and subtitle for future use
				currentOptions[i].overridetitle = "";
				currentOptions[i].subtitle = "";
			}
			else
			{
				document.querySelectorAll('#userAnswer ul li')[i].style.display = "none";
			}
		}
		
		//show question viewer
		document.getElementById('questionViewer').style.bottom = "0px";
		document.getElementById('questionViewer').style.left = "";
		//hide dice elements
		document.getElementById('hideside').style.display = "none";
	}
	else
	{
		//no question viewer, unlock dice
		setTimeout(function()
		{
			document.getElementById('rolldicebtn').onclick = rolldice;
			document.getElementById('reddice').onclick = rolldice;
			document.getElementById('invicon').onclick = showinventory;
			document.getElementById('charicon').onclick = showplayerstatus;
			document.getElementById('shopicon').onclick = showshop;
		}, 800);
	}
}

function get_attrib_limit(attribname)
{
	var entry = fxdesc({attribname:attribname}).first();
	var limit;
	if(!entry.descsM && !entry.descsF)
	{		
		limit = entry.descs.length - 1;
	}
	else
	{
		if(playertoken.stats["sex"]==0)
		{
			limit = entry.descsM.length - 1;
		}
		else
		{
			limit = entry.descsF.length - 1;
		}
	}
	return limit;
}

function adjust_attrib(attribname,amt)
{
	var newval = playertoken.stats[attribname] + amt;
	var entry = fxdesc({attribname:attribname}).first();
	var limit = get_attrib_limit(attribname);
	
	newval = newval < 0? 0:newval;
	newval = newval > limit?limit:newval;
	playertoken.stats[attribname] = newval;	
}



function PrepareTF()
{
	++tfcounter;
	showtfeffect = true;	
}

function ApplyEffect(seldat)
{
	setTimeout(function()
	{		
		if(document.getElementsByClassName('active').length > 0)
		{
			document.getElementsByClassName('active')[0].className = "";
		}
		
		var extrastr = "";
		var shownimg = seldat.img;
		var betterimg = "";
		var attribute = "";
		var showpopupafter = true;
		//apply effects!
		switch(seldat.effectname)
		{
			case "Buy Nothing":
			case "Stay Put":
			case "Ignore Chest":
			showpopupafter = false;
			break;
			case "Short Jump":
			case "Long Jump":	
			case "Decline":	
			{			
				showpopupafter = false;
				document.getElementById('rolldicebtn').onclick = "";	//remove click from the roll btn
				document.getElementById('reddice').onclick = "";	//remove click from the roll btn
				document.getElementById('invicon').onclick = "";
				document.getElementById('charicon').onclick = "";
				document.getElementById('shopicon').onclick = "";
				setTimeout(function()
				{
					MovePlayer(seldat.value);
				},500);
			}
			break;
			
			case "Glyph of Jaunting":
			case "Glyph of Protection":
			case "Glyph of Unlocking":
				showpopupafter = false;
				giveitem(seldat.effectname,1);
				useconsumable("Silver Coin",seldat.value);
				showpopup("<u>Purchased Item</u><br/><br/><span style='color:yellow'><em>\"Thank you for your purchase!\"</em></span><br/><br/><span style='float:right'>The wizard takes your silver coins, hands you a glyph, and disappears in a puff of smoke.<br/><br/><span style='color:cyan'>Purchased "+seldat.effectname+" for "+seldat.value+" silver coins.<br/><br/>Item added to inventory.</span></span>","shop2big.jpg");
				
			break;			
			
			case "Activate Glyph of Protection":
				showpopupafter = false;
				showpopup("<u>Activate Glyph of Protection</u><br/><br/><span style='color:yellow'><em>\"Not Today.\"</em></span><br/><br/><span style='float:right'>You activate a Glyph of Protection, which blossoms and flickers into a shield surrounding you, negating the incoming magical effects.<br/><br/><span style='color:cyan'>Used 1 Glyph of Protection</span></span>","dispel.jpg");
				useconsumable("Glyph of Protection",1);
			break;
			
			case "Activate Glyph of Unlocking":
			case "Open Chest":
			{
				showpopupafter = false;
				//check if the chest is trapped
				var isTrapped = (Math.floor(Math.random() * 3)==0);
				currentOptions = shuffle(filterunwantedtf(fxdata({category:"CursedTransformation"}).get())).slice(0,1);
				
				if(seldat.effectname=="Activate Glyph of Unlocking")
				{
					useconsumable("Glyph of Unlocking",1);
					isTrapped = false;
				}
				
				if(isTrapped && currentOptions.length>0)
				{									
					var trap = currentOptions[0];
					showpopup("<u>Trapped Chest</u><br/><br/><span style='color:yellow'><em>\"Surprise, you've got it wrong! The real treasure was within you all along!\"</em></span><br/><br/><span style='float:right'>The treasure chest was trapped! As you attempt to open it, a pink cloud of glittery dust explodes onto you, and you feel yourself transforming!<br/><br/><span style='color:cyan'>Gained Random Curse: "+trap.effectname+"</span></span>",
					"badchest.jpg",function(){ApplyEffect(trap);});			
					
				}
				else
				{
					//give silver coin or item
					var randitem = (shuffle(filterunwanteditems(itemsdata().get())).slice(0,1))[0];	
					var giveqty = 1;
					if(randitem.name=="Cash")	
					{
						giveqty = (Math.floor(1 + Math.random() * 28))*100;
						money += giveqty;
					}		
					giveitem(randitem.name,giveqty);						
					showpopup("<u>Treasure Looted</u><br/><br/><span style='color:yellow'><em>\"Congratulations, you've cause for celebrations. May this loot live up to your crate expectations.\"</em></span><br/><br/><span style='float:right'>You open the treasure chest and obtained a reward! (automatically added into inventory)<br/><br/><span style='color:cyan'>Got Item: "+randitem.name+" x "+giveqty+"</span></span>","goodchest.jpg");
				
				}
			}
			break;
			
			
		
			case "Strength Enhancement":
			attribute = "strength";
			adjust_attrib(attribute,1);	
			break;
			case "Stamina Enhancement":
			attribute = "stamina";
			adjust_attrib(attribute,1);
			break;
			case "Dexterity Enhancement":
			attribute = "dexterity";
			adjust_attrib(attribute,1);
			break;
			case "Eyesight Enhancement":
			attribute = "eyesight";
			adjust_attrib(attribute,1);
			break;
			case "Constitution Enhancement":
			attribute = "constitution";
			adjust_attrib(attribute,1);
			break;
			case "Intelligence Enhancement": 
			attribute = "intelligence";
			adjust_attrib(attribute,1);
			break; 
			case "Charisma Enhancement": 
			attribute = "charisma";
			adjust_attrib(attribute,1);
			break;
			case "Talent Enhancement": 
			attribute = "talent";
			adjust_attrib(attribute,1);
			break;
			case "Luck Enhancement": 
			attribute = "luck";
			adjust_attrib(attribute,1);	
			break;				
			case "Hair Growth": 
			PrepareTF();
			attribute="hair length"; adjust_attrib(attribute,1);	break;
			case "Enfeeblement": 
			PrepareTF();
			attribute="strength"; adjust_attrib(attribute,-2); break;
			case "Breast Growth": 
			PrepareTF();
			attribute="breast size"; adjust_attrib(attribute,1); break;
			case "Sex Change": 
				PrepareTF();
				if(playertoken.stats["breast size"]<2)
				{
					adjust_attrib("breast size",1); 
				}
				if(playertoken.stats["ass size"]<2){adjust_attrib("ass size",1); }
				if(playertoken.stats["hair length"]<2){adjust_attrib("hair length",1); }
				if(playertoken.stats["looks"]<2){adjust_attrib("looks",2); }
				playertoken.stats["height"] -= 6;
				playertoken.stats["height"] = playertoken.stats["height"]<minheight?minheight:playertoken.stats["height"];
				attribute="physique"; 
				adjust_attrib("sex",1); 
				adjust_attrib(attribute,1); 
			break;
			case "Extra Feminization": 
			PrepareTF();
			if(playertoken.stats["breast size"]<2)
			{
				adjust_attrib("breast size",2);
			}
			else
			{
				adjust_attrib("breast size",1);
			}
			adjust_attrib("ass size",1);	
			adjust_attrib("hair length",1);	
			if(playertoken.stats["looks"]<3){adjust_attrib("looks",1); }
			attribute="physique"; adjust_attrib(attribute,1); 
			break;
			case "Shrinking": 
			PrepareTF();
			attribute="height"; 
			playertoken.stats["height"] -= 4;
			playertoken.stats["height"] = playertoken.stats["height"]<minheight?minheight:playertoken.stats["height"];
			break;
			case "Ass Expansion": PrepareTF();attribute="ass size"; adjust_attrib(attribute,1); break;
			case "Orientation Change": PrepareTF();attribute="orientation"; 
			playertoken.stats["orientation"] = Math.floor(Math.random() * 3);
			break;
			case "Increased Libido": PrepareTF();attribute="increased libido"; adjust_attrib(attribute,1); break;
			case "Increased Sensitivity": PrepareTF();attribute="increased sensitivity"; adjust_attrib(attribute,1); break;
			case "Increased Fluids": PrepareTF();attribute="increased fluids"; adjust_attrib(attribute,1); break;
			case "Always Ready": PrepareTF();attribute="always ready"; adjust_attrib(attribute,1); break;
			case "Enhanced Orgasms": PrepareTF();attribute="enhanced orgasms"; adjust_attrib(attribute,1); break;
			case "Submissiveness": PrepareTF();attribute="submissiveness"; adjust_attrib(attribute,1); break;
			case "Optimized Body": PrepareTF();attribute="optimized body"; adjust_attrib(attribute,1); break;
			case "Multiple Orgasms": PrepareTF();attribute="multiple orgasms"; adjust_attrib(attribute,1); break;
			case "Random Orgasms": PrepareTF();attribute="random orgasms"; adjust_attrib(attribute,1); break;
			case "Triggered Orgasms": PrepareTF();attribute="triggered orgasms"; adjust_attrib(attribute,1); break;
			case "Triggered Arousal": PrepareTF();attribute="triggered arousal"; adjust_attrib(attribute,1); break;
			case "Easily Aroused": PrepareTF();attribute="easily aroused"; adjust_attrib(attribute,1); break;
			case "Hair Trigger": PrepareTF();attribute="hair trigger"; adjust_attrib(attribute,1); break;
			case "Flexible": PrepareTF();attribute="flexible"; adjust_attrib(attribute,1); break;
			case "Shrunken Assets": PrepareTF();attribute="breast size"; adjust_attrib(attribute,-2); break;
			case "Tasty Fluids": PrepareTF();attribute="tasty fluids"; adjust_attrib(attribute,1); break;
			case "Pheromones": PrepareTF();attribute="pheromones"; adjust_attrib(attribute,1); break;
			case "No Gag Reflex": PrepareTF();attribute="no gag reflex"; adjust_attrib(attribute,1); break;
			case "Oral Lover": PrepareTF();attribute="oral lover"; adjust_attrib(attribute,1); break;
			case "Anal Lover": PrepareTF();attribute="anal lover"; adjust_attrib(attribute,1); break;
			case "Infertile": PrepareTF();attribute="infertile"; adjust_attrib("very fertile",-1);adjust_attrib(attribute,1); break;
			case "Very Fertile": PrepareTF();attribute="very fertile"; adjust_attrib("infertile",-1); adjust_attrib(attribute,1); break;
			case "Pent Up": PrepareTF();attribute="pent up"; adjust_attrib(attribute,1); break;
			case "Masochistic": PrepareTF();attribute="masochistic"; adjust_attrib(attribute,1); break;
			case "Exhibitionist": PrepareTF();attribute="exhibitionist"; adjust_attrib(attribute,1); break;
			case "Lewd Dreams": PrepareTF();attribute="lewd dreams"; adjust_attrib(attribute,1); break;
			case "Age Regression": PrepareTF();attribute="age"; 
			playertoken.stats["age"] -= 2;
			playertoken.stats["age"] = playertoken.stats["age"]<minage?minage:playertoken.stats["age"];
			if(playertoken.stats["age"]<16)
			{
				playertoken.stats["height"] -= 4;
				playertoken.stats["height"] = playertoken.stats["height"]<minheight?minheight:playertoken.stats["height"];
			}
			break;
			case "Heat": PrepareTF();attribute="heat"; adjust_attrib(attribute,1); break;
			case "Wallflower": PrepareTF();attribute="charisma"; adjust_attrib(attribute,-2); break;
			case "Polycule": PrepareTF();attribute="polycule"; adjust_attrib(attribute,1); break;
			case "Fluid Addiction": PrepareTF();attribute="fluid addiction"; adjust_attrib(attribute,1); break;
			case "Lactation": PrepareTF();attribute="lactation"; adjust_attrib(attribute,1); break;
			case "Looks": PrepareTF();attribute="looks"; adjust_attrib(attribute,1); break;
			case "Hair Removal": PrepareTF();attribute="hair removal"; adjust_attrib(attribute,1); break;
			case "Sleepy": PrepareTF();attribute="sleepy"; adjust_attrib(attribute,1); break;
			case "Ditzy": PrepareTF();attribute="intelligence"; adjust_attrib(attribute,-2); break;
			case "Noisy": PrepareTF();attribute="noisy"; adjust_attrib(attribute,1); break;
			case "Orgasm Denial": PrepareTF();attribute="denial"; adjust_attrib(attribute,1); break;
			case "Clumsy": PrepareTF();attribute="dexterity"; adjust_attrib(attribute,-2); break;
			case "Enervation": PrepareTF();attribute="stamina"; adjust_attrib(attribute,-2); break;
			case "Glasses": PrepareTF();attribute="eyesight"; adjust_attrib(attribute,-2); break;
			case "Bad Luck": PrepareTF();attribute="luck"; adjust_attrib(attribute,-2); break;
			case "Palette Swap": 
			PrepareTF();
			attribute=""; adjust_attrib("palette swap",1);
			var hrc = ["Auburn","Black","Blonde","Blue","Brown","Brunette","Chesnut","Gray","Green","Pink","Platinum blonde","Red","White"];
			var eyc = ["Blue","Green","Dark brown","Brown","Hazel","Amber","Gray"];
			playertoken.stats["hair color"] = hrc[Math.floor(Math.random() * hrc.length)];
			playertoken.stats["eye color"] = eyc[Math.floor(Math.random() * eyc.length)];
			extrastr += "<br/><br/>Your hair changes to a "+toLowerFirst(playertoken.stats["hair color"])+ " color, and your eyes shift to a shade of "+toLowerFirst(playertoken.stats["eye color"])+"! Hope you like your new look!";
			break;
			case "Name Change": 
			PrepareTF();
			attribute=""; adjust_attrib("name change",1);
			var femname = ["Cindy","Jessica","Emma","Sarah","Samantha","Amanda","Sophie","Danielle","Sarah","Emily","Chloe","Mia","Victoria","Zoe"];
			playertoken.stats["name"] = femname[Math.floor(Math.random() * femname.length)];
			extrastr += "<br/><br/>Your name is now "+playertoken.stats["name"]+ " - your old name has been forgotten, history rewritten so memories and documents show you have somehow always had your changes. Only you will remember your real past, so try not to sound like a madwoman if you accidentally rely on the wrong set of memories!";
			break;
			case "Choose Silver":
			attribute="";
			giveitem("Silver Coin",1);
			break;
			default:
			console.log("should not happen: " + seldat.effectname);
			break;
			
		}
		
		if(attribute!="")
		{
			betterimg = stringify_attrib_img(attribute);
			var fancydesc = stringify_change_desc(attribute);
			if(fancydesc!="")
			{
				extrastr += "<br/><br/>"+fancydesc;
			}
			var satrd = stringify_attrib_desc(attribute,false,true);
			if(satrd!="")
			{
				extrastr += "<br/><br/>"+satrd;
			}
		}
		
		 
		if(betterimg && betterimg!="" && (shownimg=="none"||shownimg=="")){shownimg = betterimg;}
		if(showpopupafter)
		{
			showpopup("<u>"+seldat.effectname+"</u><br/><br/>"+seldat.desc+"<span style='color:cyan'>"+extrastr+"</span>",shownimg);
		}
	}, 500);
}

var submitAnswer = function()
{
	//need to update a popup here -- validation for not selecting an answer
	if(document.getElementsByClassName('active').length < 1)
	{
		return false;
	}
	
	//hide question viewer
	document.getElementById('questionViewer').style.bottom = "";	
	
	var selectedoption = document.getElementsByClassName('active')[0].value;	
	
	console.log("selected option: " + selectedoption);
	var seldat = currentOptions[selectedoption];
	
	ApplyEffect(seldat);
	//unlock dice	
	document.getElementById('hideside').style.display = "";
	setTimeout(function()
	{
		document.getElementById('rolldicebtn').onclick = rolldice;
		document.getElementById('reddice').onclick = rolldice;
		document.getElementById('invicon').onclick = showinventory;
		document.getElementById('charicon').onclick = showplayerstatus;
		document.getElementById('shopicon').onclick = showshop;
	}, 1000);
}

function toggleminimize()
{
	var qvobj = document.getElementById('questionViewer');
	if(qvobj.style.bottom == "0px")
	{
		if(qvobj.style.left=="")
		{
			qvobj.style.left = "-792px";
		}
		else
		{
			qvobj.style.left = "";
		}
	}
	else
	{
		qvobj.style.left = "";
	}
}

function hidepopup()
{
	$('.overlay, .sixDigitMsg').hide(); 	
	if(showtfeffect)
	{
		showtfeffect = false;
		playcurseanim();
	}
}

function showpopup(str,img,onnext)
{
	if(onnext)
	{
		$( "#dismisspop" ).off('click');
		$( "#dismisspop" ).click(function() { 
		$( "#dismisspop" ).off('click');
		hidepopup();		
		setTimeout(function()
		{
		onnext(); 
		},10);
		});		
	}
	else
	{
		$( "#dismisspop" ).off('click');
		$( "#dismisspop" ).click(function() { hidepopup();  });		
	}
	var html = "";
	if(img)
	{
		html+= "<img src='img/icons/"+img+"' width=140 height=140 style=\"border:2px solid #000000; margin:8px; float:left;\" />";
	}
	html+= str;
	document.getElementById('popmsg').innerHTML = html;
	$('.overlay, .sixDigitMsg').show();
}

function showshop()
{
	setQuestion(itemshopdata);
}

function showplayerstatus()
{
	var facestr = "<img src='img/icons/face"+((playertoken.stats["sex"]==0)?"0":"1")+".png' width=120 height=120 style=\"margin:6px; float: right;\" />";
	
	document.getElementById('playerstatustext').innerHTML = facestr + stringify_player(true);
	document.getElementById('playerstatus').style.bottom = '0px';
}

function showinventory()
{
	document.getElementById('inventorytext').innerHTML = "";
	document.getElementById('inventory').style.bottom = '0px';
	var invstr = "<ul>";
	var i;
	for(i=0;i<playertoken.inv.length;++i)
	{
		if(playertoken.inv[i].qty>0)
		{
			invstr += "<li value="+i+" onclick='selectinvitem(this)'>"+playertoken.inv[i].name+" x "+playertoken.inv[i].qty+"</li>";
		}
	}
	invstr += "</ul>";
	document.getElementById('inventoryicons').innerHTML = invstr;
	 
}


function selectinvitem(ele)
{	
	if(IsInt(ele))
	{
		lastselecteditem = ele;
	}
	else
	{
		setactiveans(ele);
		lastselecteditem = ele.value;
	}
	var invitm = playertoken.inv[lastselecteditem];
	var itmdata = itemsdata({name:invitm.name}).first();
	var str = "";
	if(itmdata.img && itmdata.img!="")
	{
		str += "<img src='img/icons/"+itmdata.img+"' width=100 height=100 style=\"border:2px solid #000000\" /><br/>";
	}
	str += "<u>"+invitm.name + "</u><br/>"+itmdata.desc+"<br/><br/>";
		
	if(itmdata.gameitm)
	{
		str += "<span style='color:pink;'>(GAME ITEM)</span><br/>";
	}
		
	str += "<span style='color:yellow;'>"+ itmdata.effect+"</span>";
	if(itmdata.usable) 
	{
		str += "<br/><button class='submitAns' onclick='useinvitem()'>Use Item</button>";
	}
	
	document.getElementById('inventorytext').innerHTML = str;
}

function giveitem(_name,_qty)
{
	var found = null;
	var itmdata = itemsdata({name:_name}).first();
	for(var i=0;i<playertoken.inv.length;++i)
	{
		if(playertoken.inv[i].name==_name){found=playertoken.inv[i];break;}	
	}
	if(found && itmdata.stacks)
	{
		found.qty += _qty;	
	}
	else
	{
		playertoken.inv.push({name:_name, qty:_qty});
	}
}

function qtyitem(_name)
{
	for(var i=0;i<playertoken.inv.length;++i)
	{
		if(playertoken.inv[i].name==_name && playertoken.inv[i].qty > 0){ return playertoken.inv[i].qty;}	
	}
	return 0;
}



function useconsumable(_name,amt)
{
	for(var i=0;i<playertoken.inv.length;++i)
	{
		if(playertoken.inv[i].name==_name && playertoken.inv[i].qty > 0)
		{ 
			playertoken.inv[i].qty -= amt;
			playertoken.inv[i].qty = (playertoken.inv[i].qty<0?0:playertoken.inv[i].qty);
			break;
		}	
	}
}

function useinvitem()
{
	var invitm = playertoken.inv[lastselecteditem];
	var itmdata = itemsdata({name:invitm.name}).first();
	
	invitm.qty -= 1;	
	showinventory();	
	document.getElementById('inventory').style.bottom = '';
	
	switch(invitm.name)
	{
		case "Glyph of Jaunting":
			document.getElementById('rolldicebtn').onclick = "";	//remove click from the roll btn
			document.getElementById('reddice').onclick = "";	//remove click from the roll btn
			document.getElementById('invicon').onclick = "";
			document.getElementById('charicon').onclick = "";
			document.getElementById('shopicon').onclick = "";
			setTimeout(function()
			{
				MovePlayer(6);
			},1000);
		break;
	}
	
	
}

var setactiveans = function(ele)
{
	if(document.querySelector('.active'))
	{
		document.querySelector('.active').className = "";
	}
	if(ele)
	{
		ele.className = "active";
	}
}

function selectsandbox(ele)
{
	selectchar(ele);
	setactiveans(ele);
	issandbox = true;
	document.getElementById('bios').style.display = 'block';
	document.getElementById('bio').innerHTML = "First Name: <input type=text id=ifname value='John' maxlength=15 size=8><br/>"
	+"Last Name: <input type=text id=ilname value='Smith' maxlength=15 size=8><br/>"
	+"Age: <input type=number id=iage value=26 min=18 max=80><br/>"
	+"Height (cm): <input type=number id=iheight value=180 min="+minheight+" max=200><br/>"
	+"Sex: <select id=isex><option value=0>M</option> <option value=1>F</option></select><br/>"
	+"Orientation: <select id=iori><option value=0>Prefers F</option> <option value=1>Prefers M</option><option value=2>Bisexual</option></select><br/>"
	+"Hair Color: <input type=text id=ihairc value='Brown' maxlength=15 size=8><br/>"
	+"Eye Color: <input type=text id=ieyec value='Hazel' maxlength=15 size=8><br/>"
	+"Infinite Silver Coins: <input type=checkbox id=iinfsilver>"
	+"Loaded Dice: <input type=checkbox id=iloaddice>";
	document.getElementById('bio2').innerHTML = "Sandbox mode allows customization of your starting character, and some cheat options.<br/><br/>This mode is experimental, and bad user input may crash your game. Not recommended for first playthrough.";
}

function selectchar(ele)
{
	issandbox = false;
	setactiveans(ele);
	document.getElementById('bios').style.display = 'block';
	var tmp = playerTemplates[ele.value];
	playertoken.stats["name"] = tmp["name"];
	playertoken.stats["last name"] = tmp["last name"];
	playertoken.stats["age"] = tmp["age"];
	playertoken.stats["sex"] = tmp["sex"];
	playertoken.stats["height"] = tmp["height"];
	playertoken.stats["strength"] = tmp["strength"];
	playertoken.stats["stamina"] = tmp["stamina"];
	playertoken.stats["dexterity"] = tmp["dexterity"];
	playertoken.stats["eyesight"] = tmp["eyesight"];
	playertoken.stats["constitution"] = tmp["constitution"];
	playertoken.stats["intelligence"] = tmp["intelligence"];
	playertoken.stats["charisma"] = tmp["charisma"];
	playertoken.stats["talent"] = tmp["talent"];
	playertoken.stats["luck"] = tmp["luck"];
	playertoken.stats["hair color"] = tmp["hair color"];
	playertoken.stats["eye color"] = tmp["eye color"];
	playertoken.stats["breast size"] = tmp["breast size"];
	playertoken.stats["hair length"] = tmp["hair length"];
	playertoken.stats["ass size"] = tmp["ass size"];
	playertoken.stats["physique"] = tmp["physique"];
	
	playertoken.inv = tmp.gear.slice();
	document.getElementById('bio').innerHTML = "<img src='img/icons/face0.png' width=120 height=120 /><br/>"+ stringify_player(false);
	document.getElementById('bio2').innerHTML = tmp.desc;
}

function playagain() {
    location.href = document.URL;
}


function toFeet(n) {
      var realFeet = ((n*0.393700) / 12);
      var feet = Math.floor(realFeet);
      var inches = Math.round((realFeet - feet) * 12);
      return feet + "&prime;" + inches + '&Prime;';
    }

function stringify_player(verbose)
{
	var str = "";
	str += "<span style='color:yellow'>Name:</span> " + playertoken.stats["name"] +" "+ playertoken.stats["last name"] +"<br/>";
	str += "<span style='color:yellow'>Age:</span> " + playertoken.stats["age"] +"<br/>";
	str += "<span style='color:yellow'>Sex:</span> " + stringify_attrib_desc("sex",false,false) +"<br/>";
	if(verbose)
	{
		str += "<span style='color:yellow'>Orientation:</span> " + stringify_attrib_desc("orientation",false,false) +"<br/>";
	}
	str += "<span style='color:yellow'>Height:</span> "+toFeet(playertoken.stats["height"])+" (" + playertoken.stats["height"] +"cm)<br/>";
	
	if(verbose)
	{
		str += "<span style='color:yellow'>Hair:</span> " + playertoken.stats["hair color"] +", "+ toLowerFirst(stringify_attrib_desc("hair length",false,false)) +"<br/>";		
		str += "<span style='color:yellow'>Eye Color:</span> " + playertoken.stats["eye color"] +"<br/>";
		
		if(playertoken.stats["breast size"]>0)
		{
			str += "<span style='color:yellow'>Breast Size:</span> " + stringify_attrib_desc("breast size",false,false) +"<br/>";
		}
		if(playertoken.stats["ass size"]>0)
		{
			str += "<span style='color:yellow'>Ass Size:</span> " + stringify_attrib_desc("ass size",false,false) +"<br/>";
		}
		var arr = [];
		arr.push("physique");
				
		arr.push("increased libido");
		arr.push("increased sensitivity");
		arr.push("increased fluids");
		arr.push("always ready");
		arr.push("enhanced orgasms");
		arr.push("submissiveness");
		arr.push("optimized body");
		arr.push("multiple orgasms");
		arr.push("random orgasms");
		arr.push("triggered orgasms");
		arr.push("triggered arousal");
		arr.push("easily aroused");
		arr.push("hair trigger");
		arr.push("flexible");
		arr.push("shrunken assets");
		arr.push("tasty fluids");
		arr.push("pheromones");
		arr.push("no gag reflex");
		arr.push("oral lover");
		arr.push("anal lover");
		arr.push("infertile");
		arr.push("very fertile");
		arr.push("pent up");
		arr.push("masochistic");
		arr.push("exhibitionist");
		arr.push("lewd dreams");
		arr.push("heat");
		arr.push("polycule");
		arr.push("fluid addiction");
		arr.push("lactation");
		arr.push("looks");
		arr.push("hair removal");
		arr.push("sleepy");
		arr.push("noisy");
		arr.push("denial");
		
		arr.push("strength");
		arr.push("stamina");
		arr.push("dexterity");
		arr.push("eyesight");
		arr.push("constitution");
		arr.push("intelligence");
		arr.push("charisma");
		arr.push("talent");
		arr.push("luck");	
		
		
		str += "<ul>";		
		for(var i=0;i<arr.length;++i)
		{
			var adesc = stringify_attrib_desc(arr[i],true,false);
			if(adesc!="")
			{
				str += "<li class='pic-list'><img src='img/icons/"+stringify_attrib_img(arr[i])+"' width='60' height='60' /><p>"+adesc+"</p></li>";
			}
		}
		str += "</ul>";
	}
	return str;
}

function stringify_attrib_img(attribute)
{
	var found = null;
	var imgc = configChangeImgs.length;
	for(var i=0;i<imgc;++i)
	{
		if(configChangeImgs[i].attribname == attribute)
		{
			found = configChangeImgs[i];
			break;
		}
	}
	if(found)
	{
		var lv = playertoken.stats[attribute];
		if(found.imgsF && found.imgsM)
		{
			if(IsInt(lv) && lv<found.imgsF.length && lv<found.imgsM.length)
			{
				if(playertoken.stats["sex"]==0)
				{
					return found.imgsM[lv];
				}
				else
				{
					return found.imgsF[lv];
				}
			}
			else
			{
				if(found.imgsM.length>0 && found.imgsF.length>0)
				{
					if(playertoken.stats["sex"]==0)
					{
						return found.imgsM[found.imgsM.length-1];
					}
					else
					{
						return found.imgsF[found.imgsF.length-1];
					}
				}
			}
		}
		else
		{
			if(IsInt(lv) && lv<found.imgs.length)
			{
				return found.imgs[lv];
			}
			else
			{
				if(found.imgs.length>0)
				{
					return found.imgs[found.imgs.length-1];
				}
			}
		}
	}
	return  "";
}

function stringify_change_desc(attribute)
{	
	var found = null;
	var ccdl = configChangeDescs.length;
	for(var i=0;i<ccdl;++i)
	{
		if(configChangeDescs[i].attribname == attribute)
		{
			found = configChangeDescs[i];
			break;
		}
	}
	
	if(found)
	{
		var lv = playertoken.stats[attribute];
		if(IsInt(lv))
		{
			if(!found.descsM || !found.descsF)
			{
				if(lv<found.descs.length)
				{
					return found.descs[lv];
				}
			}
			else
			{
				if(playertoken.stats["sex"]==0)
				{
					if(lv<found.descsM.length)
					{
						return found.descsM[lv];
					}
				}
				else
				{
					if(lv<found.descsF.length)
					{
						return found.descsF[lv];
					}
				}
			}
			
		}
	}
	return  "";
}

function stringify_attrib_desc(attribute, includeLabel ,describeAllChange)
{
	var fx = fxdesc({attribname:attribute}).first();
	var overrideDesc = "";
		
	var ret = "";
	
	if(fx) //if there's a readymade description, use it
	{
		
		if(!fx.descsM || !fx.descsF)
		{
			ret = fx.descs[playertoken.stats[attribute]];
		}
		else
		{
			if(playertoken.stats["sex"]==0)
			{
				ret = fx.descsM[playertoken.stats[attribute]];
			}
			else
			{
				ret = fx.descsF[playertoken.stats[attribute]];
			}
		}

		
		if(describeAllChange==true && ret=="")
		{
			ret = "Your "+attribute+" is unremarkably average.";
		}		
		if(ret!="" && includeLabel)
		{
			ret = "<span style='color:yellow'>"+attribute.toUpperCase() + "</span> - " + ret;
		}
	}
	else
	{
		ret = "Your "+attribute+" is now " + playertoken.stats[attribute];		
	}
	
	switch(attribute)
	{
		case "height":
			overrideDesc = "Your height is now " + toFeet(playertoken.stats["height"])+" (" + playertoken.stats["height"] +"cm)";
		break;
		case "breast size":
		if(describeAllChange && ret!="")
		{
			overrideDesc =  "Your "+attribute+" is now " + ret;
		}
		break;		
		case "hair length":
		case "hair color":
		if(describeAllChange && ret!="")
		{
			overrideDesc =  "Your hair is now " + toLowerFirst(ret);
		}
		break;
		case "ass size":
		if(describeAllChange && ret!="")
		{
			overrideDesc =  "Your ass is now " + toLowerFirst(ret);
		}
		break;
	}
	
	if(overrideDesc=="")
	{
		return ret;
	}
	return overrideDesc;
}

function toLowerFirst(string) 
{
	if(string.length > 0)
	{
		return string.charAt(0).toLowerCase() + string.slice(1);
	}
	return "";
}

function IsInt(data)
{
	if(typeof data === 'number')
	{
		if(data % 1 === 0)
		{
		   return true;
		}
	}
}

var preload = [
"./img/bigbox.png",
"./img/biobg.png",
"./img/dice.png",
"./img/digit1.png",
"./img/digit2.png",
"./img/digit3.png",
"./img/digit4.png",
"./img/digit5.png",
"./img/digit6.png",
"./img/innerself.png",
"./img/instr-bg.png",
"./img/inventorybg.png",
"./img/items.png",
"./img/shop.png",
"./img/Level-bg.png",
"./img/ludo_bg.png",
"./img/minmax.png",
"./img/notify.png",
"./img/options-bg.png",
"./img/options-bg_active.png",
"./img/player.png",
"./img/play_bg.png",
"./img/ques-box.png",
"./img/ques-holder.jpg",
"./img/screen1.jpg",
"./img/screen2.jpg",
"./img/screen4.jpg",
"./img/selectLevel-bg.png",
"./img/self.png",
"./img/submitBtn.png",
"./img/sucked.jpg",
"./img/surface.png",
"./img/welcome.jpg",
"./img/wellDone-bg.jpg"
];
	
var promises = [];
for (var i = 0; i < preload.length; i++) {
    (function(url, promise) {
        var img = new Image();
        img.onload = function() {
          promise.resolve();
        };
        img.src = url;
    })(preload[i], promises[i] = $.Deferred());
}

$(document).ready(function() {

	$.when.apply($, promises).done(function() {
		$('body').addClass('done');
	});

});
