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
    var id = (cardVals[1] < 2 ? "card" : "card-red");
    var className = (hidden ? "hidden" : "");
    $(player).append("<div id = '" + id + "' value = '" + cardVals[0] + "' class = '" + className + "'><span id = 'numL'>" + numLetter + "</span><span id = 'suit'>" + suitSymbols[cardVals[1]] + "</span><span id = 'numR'>" + numLetter + "</span></div>");
    return cardVals;
    //console.log((plr ? "Player" : "Computer") + " drew a " + cardVals[2] + "\nCard value: " + cardVals[0] + "\nSuit index number: " + cardVals[1] + " = " + suitSymbols[cardVals[1]] + "\nCard hidden: " + hidden);
}
function blackJack() {
    var cards = generateRandomCards();
    var currIndex = 0;
    var plrScore = 0;
    var cpuScore = 0;
    var plrBust = false;
    var cpuBust = false;
    for (var i = 0; i < 4; i++) {
        var cardVals = genCard(cards[currIndex], i < 2, i == 3);
        currIndex++;
    }
    updateScore();
    function updateScore() {
        plrScore = cpuScore = 0;
        $("#plrCardArea div").each(function() {
            var val = parseInt($(this).attr("value"));
            if (val == 1) {
                if (21 - plrScore >= 11) {
                    plrScore += 11;
                    $("#numL", this).html("A<p style = 'font-size: 20px; display: inline;'>(11)</p>");
                } else {
                    plrScore += 1;
                    $("#numL", this).html("A<p style = 'font-size: 20px; display: inline;'>(1)</p>");
                }
            } else {
                plrScore += (val > 10 ? 10 : val);
            }
        });
        $("#cpuCardArea div").each(function() {
            var val = parseInt($(this).attr("value"));
            if (val == 1) {
                if (21 - cpuScore >= 11) {
                    cpuScore += 11;
                    $("#numL", this).html("A<p style = 'font-size: 20px; display: inline;'>(11)</p>");
                } else {
                    cpuScore += 1;
                    $("#numL", this).html("A<p style = 'font-size: 20px; display: inline;'>(1)</p>");
                }
            } else {
                cpuScore += (val > 10 ? 10 : val);
            }
        });
        console.log("Updated scores\nPlr: " + plrScore + "\nComp: " + cpuScore);
        return [plrScore, cpuScore];
    }
    function hit(plr) {
        var cardVals = genCard(cards[currIndex], plr, false);
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
        $("#cpuCardArea div[class = 'hidden']").removeClass("hidden");
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
                $("#winner").text("You win!");
            }
        } else {
            if (scores[0] > scores[1]) {
                $("#winner").text("You win!");
            } else if (scores[0] < scores[1]) {
                $("#winner").text("You lose!");
            } else {
                $("#winner").text("Tie");
            }
        }
        $("#hit").off("click");
        $("#hit").css("visibility", "visible");
        $("#hit").text("Restart");
        $("#hit").click(function() {
            reset();
        });
        $("#stand").off("click");
    }
    function reset() {
        $("#stand").css("visibility", "visible");
        $("#hit").off("click");
        $("#hit").text("Hit");
        $("#plrCardArea").empty();
        $("#cpuCardArea").empty();
        $("#winner").text("");
        blackJack();
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
function slotMachine() {
    var winZones = [0, 80, 165, 237, 310, 378, 454];
    var heightClamp = 454;
    var updateRate = 120;
    var numReels = 3;
    var activeReels = 0;
    function startSpin() {
        activeReels = numReels;
        var spinRate = 0.5;
        var maxVariation = 3.0;
        $("#slotMachine div").each(function(i) {
            setInterval(function() {
                var obj = $("#slotMachine div[id = 'slotReel" + String(i + 1) + "']");
                obj.css("background-position-y", (parseInt(obj.css("background-position-y")) + (((spinRate + (parseInt(Math.random() * ((maxVariation * 100) + 1)) / 100)) * heightClamp) / updateRate)) % heightClamp);
            }, 1000 / updateRate)
        })
    }
    function stopSpin() {
        var delayBetweenStops = 0.5;
        window.clearInterval((numReels + 1) - activeReels);
        var currReel = $("#slotMachine div[id = 'slotReel" + String((numReels + 1) - activeReels) + "']");
        var pos = parseInt(currReel.css("background-position-y"));
        var closest = 0;
        for (var i = 1; i < winZones.length; i++) {
            if (Math.abs(pos - winZones[i]) < Math.abs(pos - winZones[closest])) {
                closest = i;
            }
        }
        currReel.css("background-position-y", winZones[closest]);
        //console.log(winZones[closest])
        activeReels--;
        if (activeReels > 0) {
            setTimeout(stopSpin, delayBetweenStops * 1000);
        }
    }
    startSpin();
    setTimeout(stopSpin, 3000);
}
blackJack();
slotMachine();