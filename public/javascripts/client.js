/* Code shared between client and server.
*
*   we first have constructors for everything
*   then we instantiate them things
*   and lastly the game is started.
*/
console.log("Welcome to Snakes & Ladders!");

// [Client-Side Console lookalike]
function ClientConsole(){
    this.setStatus = function(status){
        document.getElementById("clientconsole").innerHTML = status;
    };
}
// [Ladder]
Ladder = function(start, end){
    this.start = start;
    this.end = end;
}
Ladder.prototype.getStart = function(){return this.start; };
Ladder.prototype.setStart = function(){this.start = start; };
Ladder.prototype.getEnd = function(){return this.end; };
Ladder.prototype.setEnd = function(){this.end = end; };
Ladder.prototype.getDiff = function(){return (this.getEnd() - this.getStart()); };
Ladder.prototype.toLadder = function(){
    return "<img class=\"Ladder\" id=\"l"+ this.getDiff() + "\" src=\"./images/Ladder" + this.getDiff() + ".png\">";;
}
// [Snake]
Snake = function(head, tail){
    this.head = head;
    this.tail = tail;
}
Snake.prototype.getHead = function(){return this.head; };
Snake.prototype.setHead = function(){this.head = head; };
Snake.prototype.getTail = function(){return this.tail; };
Snake.prototype.setTail = function(){this.tail = tail; };
Snake.prototype.getDiff = function(){return (this.getTail() - this.getHead()); };
Snake.prototype.toSnake = function(){
    return "<img class=\"Snake\" id=\"s"+ Math.abs(this.getDiff()) +"\" src=\"./images/Snake" + Math.abs(this.getDiff()) + ".png\">";;
}
// [Player]
Player = function (Color, position){
    this.Color = Color;
    this.position = position;
}
Player.prototype.getColor = function(){return this.Color; };
Player.prototype.setColor = function(Color) {this.Color = Color; };
Player.prototype.getPosition = function(){return this.position; };
Player.prototype.setPosition = function(position) {this.position = position;};
// this will make sure we get a visible pawn on the board
Player.prototype.toPawn = function() { 
    return "<img id=\"pawn\" src=\"./images/Pawn" + this.getColor() + ".png\">";
}
//sets the pawn of the player to the new position after rolling the dice
function Spawn(Player, position){
    var prev = Player.getPosition();
    Player.setPosition(position);
    var next = Player.getPosition();
    var place = document.getElementById(prev);

    place.innerHTML == Player.toPawn;
    place.innerHTML = place.innerHTML.replace(Player.toPawn(), '');
    document.getElementById(next).innerHTML += Player.toPawn();
}
//  [Snakes in an array]
var Snakes = [];
var s1 = new Snake(48,12);
Snakes.push(s1);
var s2 = new Snake(21,7);
Snakes.push(s2);

// [Ladders in an array]
var Ladders = [];
var l1 = new Ladder(4, 20);
Ladders.push(l1);
var l2 = new Ladder(33, 43);
Ladders.push(l2);

// [Players in an array]
var Players = [];
var p1 = new Player("Blue");
var p2 = new Player("Red");
Players.push(p1);
Players.push(p2);

/*  [STATUS MESSAGES] */
/*   so the players will actually know what the heck is going on */
var Status = {};
/* [LANGUAGE SUPPORT] */
function setLanguage(language){
    if(language == "ch"){
        this.Status["language"] = "你转了显示语言!";
        this.Status["Winning"] = "恭喜恭喜， 你很厉害！<br/>";
        this.Status["Losing"] = "别画蛇添足。</br>";
        this.Status["newRound"] = "请你来玩 <a href='/game'>在一边？</a>";
        this.Status["welcomeplayer1"] = "欢迎帅哥！ 你怎么了？ 请你掷骰子吧";
        this.Status["welcomeplayer2"] = "你好啦！<br/>你肯玩吗？";
        this.Status["moved"] = "你掷了骰子，现在请你等一下";
        this.Status["turn"] = "请你掷骰子吧！";
        this.Status["aborted"] = "你的对放去了，但是没哭拉！<br/>" + Status["newRound"];
        // because it looks better
        document.getElementById("clientconsole").style.fontSize = "1.5vw";
        document.getElementById("languages").innerHTML = ''
        + '<button id="closedialog" onclick="hideLanguages()">x</button>'
        + '<h1>语言选择</h1>'
        + ' <button onclick="setLanguage(\'ch\')">中文</button>'
        + ' <button onclick="setLanguage(\'nl\')">荷兰语</button>'
        + ' <button onclick="setLanguage(\'default\')">英语</button>'
    }
    if(language == "nl"){
        this.Status["language"] = "Je speelt het spel nu in het Nederlands.";
        this.Status["Winning"] = "Yass! goeie! je hebt het gefixt!<br/>";
        this.Status["Losing"] = "Big girls don't cry;</br>";
        this.Status["newRound"] = "Nog <a href='/game'>een rondje</a> doen?";
        this.Status["welcomeplayer1"] = "Hey hoi! <br/>Als je er klaar voor bent, dan mag je gooien";
        this.Status["welcomeplayer2"] = "Dag";
        this.Status["moved"] = "Wow, dat ging goed,<br/>Jij komt er wel.";
        this.Status["turn"] = "Je bent aan de beurt.<br/>";
        this.Status["aborted"] = "Je staat er nu alleen voor. <br/>" + Status["newRound"];
        document.getElementById("clientconsole").style.fontSize = "1vw";
        document.getElementById("languages").innerHTML = ''
        + '<button id="closedialog" onclick="hideLanguages()">x</button>'
        + '<h1>Kies een taal</h1>'
        + ' <button onclick="setLanguage(\'ch\')">Chinees</button>'
        + ' <button onclick="setLanguage(\'nl\')">Nederlands</button>'
        + ' <button onclick="setLanguage(\'default\')">Engels</button>'
    }
    if(language == "default") {
        this.Status["language"] = "You're playing this game in<br/>English language.";
        this.Status["Winning"] = "Congratulations! You made it through!<br/>";
        this.Status["Losing"] = "Big girls don't cry;</br>";
        this.Status["newRound"] = "shall we <a href='/game'>play another round?</a>";
        this.Status["welcomeplayer1"] = "Dear Mr. Heathcliff, welcome to our humble <br/>tea party! Roll the dice.";
        this.Status["welcomeplayer2"] = "My dearest Cathy, entrez-vous!<br/>";
        this.Status["moved"] = "You just made a move, <br/>now let's see what your fellow is up to.";
        this.Status["turn"] = "Hurry! it's your turn.<br/>Show them what you got!";
        this.Status["aborted"] = "Your Heathcliff left, but you needn't whine: <br/>" + Status["newRound"];
        document.getElementById("clientconsole").style.fontSize = "1vw";
        document.getElementById("languages").innerHTML = ''
        + '<button id="closedialog" onclick="hideLanguages()">x</button>'
        + '<h1>Choose your language</h1>'
        + ' <button onclick="setLanguage(\'ch\')">Mandarin Chinese</button>'
        + ' <button onclick="setLanguage(\'nl\')">Dutch</button>'
        + ' <button onclick="setLanguage(\'default\')">English</button>'
    }
    document.getElementById("clientconsole").innerHTML = this.Status["language"];
}
/* Let's check for a language cookie */

setLanguage('default');

/* [OBJECT CREATOR] */
/* at this point we generate the objects on the board*/
function createObjects() {
    Players.forEach(function(element){
        element.setPosition(1);
        Spawn(element, 1);
        console.log("a teacup has been placed on the board with color " + element.getColor());
    })
    Ladders.forEach(function(element){
        element.getStart();
        document.body.innerHTML += element.toLadder();
        console.log("a ladder has been added with difference " + element.getDiff());
    })
    Snakes.forEach(function(element){
     element.getHead();
     document.body.innerHTML += element.toSnake();
     console.log("a Snake has been added with difference " + Math.abs(element.getDiff()));
 })
}
/* [SHOW PLAYERTYPE] */
/* Might be cool if you can actually see which color you're playing with*/
function renderplayerType(p){
    if (p == "B"){
        drawer = document.getElementById("drawer")
        drawer.setAttribute('src', './images/drawer_'+ p +'.png');
    }
}
/* [GAMESTATE] */
/* this is the gamestate constructor*/
function GameState(sb, socket){
    this.playerType = null;
    this.ClientConsole = sb;
    this.getPlayerType = function () {
        return this.playerType;
    };
    this.setPlayerType = function (p) {
        renderplayerType(p);
        this.playerType = p;
    };

    this.updateGame = function(playerAposition, playerBposition, score){
        document.getElementById("dice").innerHTML = "<img src=\"./images/" + score + ".png\">";
        Spawn(p1, playerAposition);
        Spawn(p2, playerBposition);
    };
}
/* [ SET UP ] */
var winner = null;
(function setup(){
    var HOST = location.origin.replace(/^http/, 'ws')
    var socket = new WebSocket(HOST);
    var sb = new ClientConsole();
    createObjects();
    var gs = new GameState(sb, socket);
    socket.onmessage = function (event) {
        let whosturn = JSON.parse(event.data);
        if (whosturn.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(whosturn.data);
            if (gs.getPlayerType() == "A") {
                sb.setStatus(Status["welcomeplayer1"]);
                }
            }
            if (gs.getPlayerType() == "B") {
                sb.setStatus(Status["welcomeplayer2"]);
            }
            const dices = document.querySelectorAll('.dices'); 
            dices.forEach(dice => dice.addEventListener('mousedown', sendoutgoingmessage));
                function sendoutgoingmessage(){
                    let outgoing = Messages.O_TURN;
                    outgoing.data = gs.getPlayerType();
                    socket.send(JSON.stringify(outgoing));
        }
    /* [ TURN ] */
        if((whosturn.type == Messages.T_TURN)){
            if(whosturn.data === gs.getPlayerType()){
                sb.setStatus(Status["turn"]);
            }
            if(!(whosturn.data === gs.getPlayerType())) {
                sb.setStatus(Status["moved"]); 
            }
            gs.updateGame(whosturn.posA, whosturn.posB, whosturn.dicevalue); 
        } 
    /* [ GAME WON ] */
        if((whosturn.type == Messages.T_GAME_WON_BY)){
            this.winner = whosturn.data;
            if(this.winner == gs.getPlayerType()){
                endString = Status["Winning"];
            }
            else {
                endString = Status["Losing"];
            }
            endString += Status["newRound"];
            sb.setStatus(endString);
            socket.close();
        }
    };

    socket.onopen = function(){
        socket.send("{}");
    };

    //server sends a close event only if the game was aborted from some side
    socket.onclose = function(){
        if(this.winner == null){
            sb.setStatus(Status["aborted"]);
        }
    };

    socket.onerror = function(){  
    };
})(); //execute immediately

/* [Clock] */
const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

function setDate() {
  const now = new Date();
  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
  minsHand.style.transform = `rotate(${minsDegrees}deg)`;

  const hour = now.getHours();
  const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
}
 
setInterval(setDate, 1000);
setDate();

/* [FULLSCREEN MODE] */
var page = document.documentElement;
function openFullscreen() {
  if (page.requestFullscreen) {
    page.requestFullscreen();
  } else if (page.mozRequestFullScreen) { /* Firefox */
    page.mozRequestFullScreen();
  } else if (page.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    page.webkitRequestFullscreen();
  }
  document.getElementById("fullscreen").setAttribute('src', "./images/fullscreen_close.png");
  document.getElementById("fullscreen").setAttribute('onclick', "closeFullscreen()"); 
}
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {/* Firefox support */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {/* Chrome, Safari & Opera support */
    document.webkitExitFullscreen();
  }
  document.getElementById("fullscreen").setAttribute('src', "./images/fullscreen_open.png");
  document.getElementById("fullscreen").setAttribute('onclick', "openFullscreen()");
}
// calling it because then it will be less messy in the game.html
closeFullscreen();

/* [LANGUAGE SUPPORT] */
//  because it's hella cool to have different languages heh
function showLanguages(){
    document.getElementById("languages").style.display = "block";
}
function hideLanguages(){
    document.getElementById("languages").style.display = "none";
}