/* [SPLASH SCREEN] */
console.log("Welcome to Snakes & Ladders!");

var snakes = document.querySelectorAll(".snake");
snakes.forEach(element => element.querySelector('img').onmouseover = function() {mouseOverSnake(this, element.id)});
snakes.forEach(element => element.querySelector('img').onmouseout = function() {mouseOutSnake(this, element.id)});

function mouseOverSnake(img, id) {
    img.setAttribute('src', './images/' + id + 'talk.png');
}
function mouseOutSnake(img, id) {
    img.setAttribute('src', './images/' + id + '.png');
}

/* [COOKIES] */
function setCookie(cookiename, cookievalue, exdays){
    var date = new Date;
    date.setTime(date.setTime() + (exdays*24*60*60*1000));
    var expires = "expires= " +date.toUTCString();
    document.cookie= cookiename + "=" + cookievalue + ";" + expires + ";path=/";
};
// cookies
function getCookie(cookiename) {
    var name = cookiename + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

function checkCookie() {
    // first log username
    var returnobject = "";
    var username = getCookie("username");
    if (username != "") {
        returnobject = "Welcome again, " + username + " !<br/>";
    } else {
        username = prompt("Welcome to Snakes and ladders, please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
    // now log visits
    var visits = getCookie("visits");
        if (visits != "") {
            visits ++;
            var s = "";
            if (visits > 1){
                s = "s";
            }
            returnobject = returnobject + "You've already been here " + visits + " time"+ s + " before.";
        } else {
            visits = 0;
        }
    setCookie("visits", visits, 365);
    var object = document.getElementById("cookies");
    object.innerHTML = returnobject;
}

window.onload = checkCookie();