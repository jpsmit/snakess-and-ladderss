var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

// var gameStats = require("./statTracker");
var gameStats = {
    since : Date.now(),     /* since we keep it simple and in-memory, keep track of when this object was created */
    gamesStarted : 0,   /* number of games initialized */
    gamesStopped : 0,       /* number of games aborted */
    gamesFinished : 0      /* number of games successfully completed */
};
var Game = require("./game");

var port = process.argv[2];
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/game", indexRouter);
//@important! how to move this though
app.get("/", (req, res) => {
    res.render("splash.ejs", { gamesStarted: gameStats.gamesStarted, gamesFinished: gameStats.gamesFinished });
});

var server = http.createServer(app);
const socket = new websocket.Server({ server });
var websockets = {};//property: websocket, value: game

/*
 * regularly clean up the websockets object
 */ 
setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if(gameObj.finalStatus!=null){
                console.log("\tDeleting element "+i);
                delete websockets[i];
            }
        }
    }
}, 50000);
var currentGame = new Game(gameStats.gamesStarted++);
var connectionID = 0;//each websocket receives a unique ID

socket.on("connection", function connection(ws) {
    /*
     * we made a two-player game: every two players are added to the same game
     */
    let currentplayer = ws; 
    currentplayer.id = connectionID++;
    let playerType = currentGame.addPlayer(currentplayer);
    websockets[currentplayer.id] = currentGame;
    console.log("Player %s placed in game %s as %s", currentplayer.id, currentGame.id, playerType);
    //  inform the client about its assigned player type
    currentplayer.send((playerType == "A") ? messages.S_PLAYER_A : messages.S_PLAYER_B);

    /*
     * so now we have two players, yay
     * if a player now leaves, the game is aborted (player is not replaced)
     */ 
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStats.gamesStarted++);
    }
    /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player
     *  3. send the message to the other player
     */ 
    currentplayer.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);
        let gameObject = websockets[currentplayer.id];
        // we first check if there are two connected players
        if(gameObject.hasTwoConnectedPlayers() & !(gameObject.isfinished)){             
            /*
             * If the game has two connected players, then we will
             * let them send requests for data and object changes.
             */
            var response = messages.O_TURN;
            if(gameObject.turn == 1){
                if(oMsg.type == messages.T_TURN && (gameObject.playerB == currentplayer)){
                    gameObject.rolldice(playerType);
                    // here we pass the turn to the other player
                    response.data = "A";
                    response.posA = gameObject.posA;
                    response.posB = gameObject.posB;
                    response.dicevalue = gameObject.dicevalue;
                    gameObject.playerB.send(JSON.stringify(response));
                    gameObject.playerA.send(JSON.stringify(response));  
                    }
                }
                if(gameObject.turn == 0){
                if (oMsg.type == messages.T_TURN && (gameObject.playerA == currentplayer)){
                    gameObject.rolldice(playerType);
                    var response = messages.O_TURN;
                    response.data = "B";
                    response.posA = gameObject.posA;
                    response.posB = gameObject.posB;
                    response.dicevalue = gameObject.dicevalue;
                    gameObject.playerB.send(JSON.stringify(response));
                    gameObject.playerA.send(JSON.stringify(response));  
                }
            }
        }
        // if(oMsg.type == messages.T_GAME_WON_BY){
            if (gameObject.isfinished){
            var response = messages.O_GAME_WON_BY;
            response.data = gameObject.gameState;
            gameObject.playerB.send(JSON.stringify(response));
            gameObject.playerA.send(JSON.stringify(response));
            //game was won by somebody, update statistics
            gameStats.gamesfinished++;
        }   
            /*
             * in the end both players get a message that terminates their game.
             */ 
       
        }
    );

    /*  The final part of code is a routine of closing
    *   the websocket parts. we need it.
    */
    currentplayer.on("close", function (code) {
        /*
         * code 1001 means almost always closing initiated by the client
         */
        console.log("Player " + currentplayer.id + " has been disconnected from game " + websockets[currentplayer.id].id);

        if (code == "1001") {
            /*
            * if possible, abort the game; if not, the game is already completed
            */
            let gameObj = websockets[currentplayer.id];
            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED"); 
                gameStats.gamesStopped++;

                /*
                 * determine whose connection remains open;
                 * close it
                 */
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                }
                catch(e){
                    console.log("Player A closing: "+ e);
                }

                try {
                    gameObj.playerB.close(); 
                    gameObj.playerB = null;
                }
                catch(e){
                    console.log("Player B closing: " + e);
                }                
            }
        }
    });
});

server.listen(process.env.PORT || 3000);