getElement = function(v,x){
	let w = [];
	for(var i=0;i<v.length;i++){
		if(v[i]==x){
			w.push(v[i]);
		}
	}
	return w;
}

getValueHand = function(h){
	let ranks_table = new Array(13).fill(0);
	let suits_table = new Array(4).fill(0);
	let high_card = values["2"];
	let low_card = values["A"];
	for(var i=0;i<h.length;i++){
		ranks_table[values[h[i][0]]-2]++;
		suits_table[cod_suits[h[i][1]]]++;
		high_card = Math.max(high_card,values[h[i][0]]);
		low_card = Math.min(low_card,values[h[i][0]]);
	}

	let isFlush = false;
	let isStraight = false;
	if(suits_table.includes(5)){
		isFlush = true;
	}
	if((high_card-low_card)==4){
		isStraight = true;
	}
	
	for(var i=0;i<ranks_table.length;i++){
		if(ranks_table[i]>1){
			isStraight = false;
		}
	}
	
	let isStraightFlush = isStraight && isFlush;
	
	let npairs = getElement(ranks_table,2).length;
	
	if(isStraightFlush){
		if(high_card==values["A"]){
			return "Royal Straight Flush";
		}
		return "Straight Flush";
	}
	else if(ranks_table.includes(4)){
		return "Four of a Kind";
	}
	else if((ranks_table.includes(3))&&(ranks_table.includes(2))){
		return "Full House";
	}
	else if(isFlush){
		return "Flush";
	}
	else if(isStraight){
		return "Straight";
	}
	else if(ranks_table.includes(3)){
		return "Three of a Kind";
	}
	else if(npairs==2){
		return "Two Pairs";
	}
	else if(npairs==1){
		return "Pair";
	}
	else if(high_card>=values["J"]){
		return "Jacks or Better";
	}
	else{
		return "Nothing";
	}
}

shuffle = function(array){
	return array.sort((a,b) => 0.5 - Math.random());
}

init_deck = function(ranks,suits){
	var v = [];
	for(var i=0;i<ranks.length;i++){
		for(var j=0;j<suits.length;j++){
			v.push([ranks[i],suits[j]]);
		}
	}
	return v;
}

new_game = function(){
	while(true){
		let x = prompt("Write initial money: ",100);
		money = Number(x);
		if(Number.isInteger(money)){
			if(x>0){
				document.getElementById("money").innerHTML="$ "+money;
				document.getElementById("message").innerHTML="You init with $ "+money+" . Make your bet. ";
				break;
			}
			else if(x<0){
				alert("Error. Negative Money.");
			}
			else{
				alert("Error. 0 money.");
			}
		}
		else{
			alert("It's not a integer.");
		}
	}
	bgame = true;
}

hold = function(x){
	if(bdraw&&bok){
		let card = hand[x];
		hold_cards[x] = ! hold_cards[x];
		if(hold_cards[x]){
			document.getElementById("card"+(x+1)).src = "img/"+card[0]+card[1]+".png";
		}
		else{
			document.getElementById("card"+(x+1)).src = "img/close.png";
		}
	}
}

draw = function(){
	if(bgame&&bok){
		if(bdraw){
			for(var i=0;i<hand.length;i++){
				if(!hold_cards[i]){
					card = deck.pop();
					hand[i] = card;
					document.getElementById("card"+(i+1)).src = "img/"+card[0]+card[1]+".png";
				}
			}

			mod_cash(hands[getValueHand(hand)]*yourBet,0);
			
			st = "Your bet is $ "+yourBet+'. ';
			st+="Your Hand is "+getValueHand(hand)+'. ';
			st+="Multiply your bet by "+hands[getValueHand(hand)]+'. ';
			st+="You earn "+hands[getValueHand(hand)]*yourBet;
			document.getElementById("message").innerHTML=st;
			
			document.getElementById("in-bet").value = 0;
			yourBet = 0;
			bok = false;
		}
		else{
			deck = Array.from(shuffle(deck0));
			hand = [];
			hold_cards = [true,true,true,true,true];
			let card;
			for(var i=1;i<=5;i++){
				card = deck.pop();
				hand.push(card);
				document.getElementById("card"+i).src = "img/"+card[0]+card[1]+".png";
			}
		}
		bdraw = ! bdraw;
	}
}

mod_cash = function(x,y){
	let barg1 = (((money+x)>=0)&&(x<=0))||(x>0);
	let barg2 = (((yourBet+y)>=0)&&(y<=0))||(y>0);
	if(barg1&&barg2){
		money += x;
		yourBet += y;
		document.getElementById("in-bet").value=yourBet;
		document.getElementById("message").innerHTML='You bet  $ '+yourBet;
		document.getElementById("money").innerHTML="$ "+money;
	}
}

bet = function(){
	if(bok){
		let x = Number(document.getElementById("in-bet").value);
		mod_cash(-x,x);
	}
}

add_bet = function(x){
	if(bok){
		mod_cash(-x,x);
	}
}

sub_bet = function(x){
	if(bok){
		mod_cash(x,-x);
	}
}

reset_bet = function(){
	if(bok){
		mod_cash(yourBet,-yourBet);
	}
}

all_in = function(){
	if(bok){
		mod_cash(-money,money);
	}
}

ok = function(){
	if(!bok){
		document.getElementById("message").innerHTML='Make your bet. ';
		for(var i=0;i<5;i++){
			document.getElementById("card"+(i+1)).src = "img/close.png";
		}
	}
	bok = bok||true;
}

const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const suits = ["D","S","H","C"]; // diamonds, spades, hearts and clubs
const values = {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"J":11,"Q":12,"K":13,"A":14};
const cod_suits = {"D":0,"S":1,"H":2,"C":3};
const hands = {
	"Nothing":0,
	"Jacks or Better":1,
	"Pair":2,
	"Two Pairs":3,
	"Three of a Kind":4,
	"Straight":5,
	"Flush":6,
	"Full House":7,
	"Four of a Kind":8,
	"Straight Flush":9,
	"Royal Straight Flush":10
}
var deck0 = init_deck(ranks,suits);

var deck = [];
var hand = [];
var hold_cards;
var money;

var bgame = false;
var bdraw = false;

var yourBet = 0;

var bok = true;