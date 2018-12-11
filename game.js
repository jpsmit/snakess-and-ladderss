/* every game has two players, identified by their WebSocket */
var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.posA = 1;
    this.posB = 1;
    this.turn = 0;
    this.isfinished = false;
    this.dicevalue = 1;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

/*
 * The game can be in a number of different states.
 */
game.prototype.logmessage = {};
game.prototype.logmessage["0 JOINT"] = 0;
game.prototype.logmessage["1 JOINT"] = 1;
game.prototype.logmessage["2 JOINT"] = 2;
game.prototype.logmessage["A"] = 4; //A won
game.prototype.logmessage["B"] = 5; //B won
game.prototype.logmessage["ABORTED"] = 6;

/*
 * Not all game states can be transformed into each other;
 * the matrix contains the valid transitions.
 * They are checked each time a state change is attempted.
 */ 
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0],   //0 JOIN
    [1, 0, 1, 0, 0, 0, 0],   //1 JOIN
    [0, 0, 0, 1, 1, 0, 1],   //DOUBLE JOIN
    [0, 0, 0, 0, 0, 0, 0],   //A WON
    [0, 0, 0, 0, 0, 0, 0],   //B WON
    [0, 0, 0, 0, 0, 0, 0]    //ABORTED
];


game.prototype.isValidTransition = function (from, to) {
    let i, j;
    if (! (from in game.prototype.logmessage)) {
        return false;
    }
    else {
        i = game.prototype.logmessage[from];
    }

    if (!(to in game.prototype.logmessage)) {
        return false;
    }
    else {
        j = game.prototype.logmessage[to];
    }
    return (game.prototype.transitionMatrix[i][j] > 0);
};

game.prototype.isValidState = function (s) {
    return (s in game.prototype.logmessage);
};
// so we need this piece of code because otherwise
// players can't find each other after a refresh
game.prototype.setStatus = function (w) {
    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    }
    else {
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINT");
};

game.prototype.addPlayer = function (p) {
    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    /*
     * revise the game state
     */ 
    var error = this.setStatus("1 JOINT");
    if(error instanceof Error){
        this.setStatus("2 JOINT");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    }
    else {
        this.playerB = p;
        return "B";
    }
};

game.prototype.getPlayerPositionA = function(){
    return this.posA;
}
game.prototype.getPlayerPositionB = function(){
    return this.posB;
}


    /*
     * roll the dice
     */
game.prototype.rolldice = function(p){
    var returnvalue = 0;
    // Here we check what player is trying to roll the dice
    if (p == "A"){
        // if it's the player's turn, we will execute more code:
        if (this.turn == 0){
            // we pick a random value to change the dice object into it later on
            // and we alter the position then.
            this.dicevalue = Math.floor((Math.random() * 6) + 1);
            this.posA += this.dicevalue;
            this.step("A");
            // this ensures no player will be placed but on the board.
            if(this.posA >= 49){
            this.posA = 49;
            this.gameState = "A";
            console.log("[STATUS] %s won game %s", this.gameState, this.id);
            this.isfinished = true;
            } else{
            returnvalue = this.posA;
            console.log("%s is now at place %s", p, returnvalue);
            this.turn = 1;
            }
         }
    }
    if (p == "B"){
        if (this.turn == 1){
            this.dicevalue = Math.floor((Math.random() * 6) + 1);
            this.posB += this.dicevalue;
            this.step("B");
            if(this.posB >= 49){
                this.posB = 49;
                this.gameState = "B";
                console.log("[STATUS] %s won game %s", this.gameState, this.id);
                this.isfinished = true;
            }
            else{
            returnvalue = this.posB;
            console.log("%s is now at place %s", p, returnvalue);
            this.turn = 0;
            }
        }  
    }  
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


game.prototype.step = function(player){
    if(!(this.isfinished)){
    if(player == "A"){
        Ladders.forEach(Ladder => {
            if(Ladder.getStart() === this.posA){ 
                this.posA += Ladder.getDiff();
                console.log("Player A climbs the ladder and is now at place %s", this.posA);
            }                
        });
    
        Snakes.forEach(Snake =>{
            if(Snake.getHead() === this.posA){
                this.posA += Snake.getDiff();
                console.log("Player A stepped on a snake and went %s steps back.", Math.abs(Snake.getDiff()));
            }
        });
    }
    
    if(player == "B"){
        Ladders.forEach(Ladder => {
            if(Ladder.getStart() === this.posB){ 
                this.posB += Ladder.getDiff();
                console.log("Player B climbs the ladder and is now at place %s", this.posB);
            }                
        });
    
        Snakes.forEach(Snake =>{
            if(Snake.getHead() === this.posB){
                this.posB += Snake.getDiff();
                console.log("Player B stepped on a snake and went %s steps back.", Math.abs(Snake.getDiff()));
            }
        });
    }
}
}


module.exports = game;