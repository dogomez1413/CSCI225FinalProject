//There is not much here right now, just some test code
function generateRandomCards() {
    var cardList = []
    for (var i = 0; i <= 51; i++) {
        cardList[i] = i;
    }
    for (var i = 51; i > 0; i--) {
        var newIndex = parseInt(Math.random() * i);
        var hold = cardList[i];
        cardList[i] = cardList[newIndex];
        cardList[newIndex] = hold;
    }
    return cardList;
}
function decodeCard(cardNum) {
    var suits = ["Spades", "Clubs", "Hearts", "Diamonds"];
    var stringNum;
    switch (cardNum % 13) {
        case 0:
            stringNum = "Ace";
            break;
        case 10:
            stringNum = "Jack";
            break;
        case 11:
            stringNum = "Queen";
            break;
        case 12:
            stringNum = "King";
            break;
        default:
            stringNum = String((cardNum % 13) + 1);
            break;
    }
    return [(cardNum % 13) + 1, Math.floor(cardNum / 13), stringNum + " of " + suits[Math.floor(cardNum / 13)]];
}
function genCard(cardNum, plr, hidden) {
    var cardVals = decodeCard(cardNum);
    var suitSymbols = ["&spades;", "&clubs;", "&hearts;", "&diams;"];
    var numLetter;
    switch (cardVals[0]) {
        case 1:
            numLetter = "A";
            break;
        case 11:
            numLetter = "J";
            break;
        case 12:
            numLetter = "Q";
            break;
        case 13:
            numLetter = "K";
            break;
        default:
            numLetter = String(cardVals[0]);
            break;
    }
    var player = (plr ? "#plrCardArea" : "#cpuCardArea")
    var id = (hidden ? "card-hidden" : "card") + (cardVals[1] < 2 ? "" : "-red");
    $(player).append("<div id = '" + id + "' value = '" + cardVals[0] + "'><span id = 'numL'>" + numLetter + "</span><span id = 'suit'>" + suitSymbols[cardVals[1]] + "</span><span id = 'numR'>" + numLetter + "</span></div>");
    //console.log((plr ? "Player" : "Computer") + " drew a " + cardVals[2] + "\nCard value: " + cardVals[0] + "\nSuit index number: " + cardVals[1] + " = " + suitSymbols[cardVals[1]] + "\nCard hidden: " + hidden);
}
function game() {
    var cards = generateRandomCards();
    var currIndex = 0;
    var plrScore = 0;
    var cpuScore = 0;
    var plrBust = false;
    var cpuBust = false;
    for (var i = 0; i < 4; i++) {
        genCard(cards[currIndex], i < 2, i == 3);
        currIndex++;
    }
    updateScore();
    function updateScore() {
        plrScore = cpuScore = 0;
        $("#plrCardArea div").each(function() {
            var val = parseInt($(this).attr("value"));
            plrScore += (val > 10 ? 10 : val);
        });
        $("#cpuCardArea div").each(function() {
            var val = parseInt($(this).attr("value"));
            cpuScore += (val > 10 ? 10 : val);
        });
        //console.log("Updated scores\nPlr: " + plrScore + "\nComp: " + cpuScore);
        return [plrScore, cpuScore];
    }
    function hit(plr) {
        genCard(cards[currIndex], plr, false);
        currIndex++;
        var scores = updateScore();
        if (plr && scores[0] > 21) {
            plrBust = true;
            $("#hit").css("visibility", "hidden");
            $("#stand").css("visibility", "hidden");
            cpu();
        }
    }
    function cpu() {
        var currScore = updateScore()[1];
        while (currScore < 17) {
            hit(false);
            currScore = updateScore()[1];
        }
        cpuBust = currScore > 21
        $("#cpuCardArea div[id *= 'hidden']").attr("id", String($("#cpuCardArea div[id *= 'hidden']").attr("id")).replace("-hidden", ""));
        gameEnd();
    }
    function gameEnd() {
        var scores = updateScore();
        if (plrBust || cpuBust) {
            if (plrBust && cpuBust) {
                $("#winner").text("Tie");
            } else if (plrBust) {
                $("#winner").text("You lose!");
            } else {
                $("#winner").text("You're winner!");
            }
        } else {
            if (scores[0] > scores[1]) {
                $("#winner").text("You're winner!");
            } else if (scores[0] < scores[1]) {
                $("#winner").text("You lose!");
            } else {
                $("#winner").text("Tie");
            }
        }
        $("#hit").off("click");
        $("#stand").off("click");
    }
    $("#hit").click(function() {
        hit(true);
    });
    $("#stand").click(function() {
        $("#hit").css("visibility", "hidden");
        $("#stand").css("visibility", "hidden");
        cpu();
    });
}
game()