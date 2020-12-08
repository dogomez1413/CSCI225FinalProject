const firebaseConfig = {
    apiKey: "AIzaSyC4_i42vQnVEVuWJopVGh9fjKKU0NYz1Zs",
    authDomain: "csci225-casino-data.firebaseapp.com",
    projectId: "csci225-casino-data",
    storageBucket: "csci225-casino-data.appspot.com",
    messagingSenderId: "512259801878",
    appId: "1:512259801878:web:026e825b28eef77e05c637",
    measurementId: "G-9V9E4QMBR5"
  };
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const google = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const collection = firebase.firestore().collection("game-data");
const startingChips = 5000;
var user = null;
var userData = null;
var localChips = startingChips;
function giveMeLotsOfMoneyPleaseOkayCoolThanks() { //Debug
    localChips += 100000;
    updateData();
}
function updateData() {
    if (user != null) {
        collection.doc(user.uid).set({chips: Math.max(localChips, 0)}, {merge: true});
    }
    $("#slotMachine #chips").text("Chips: " + localChips);
}
$("#loginState").click(function(ele) {
    ele.preventDefault();
    auth.signInWithRedirect(google);
})
auth.getRedirectResult().then(function(result) {
    user = result.user;
    if (user == null) {
        $("#loginText").text("You are not currently logged in");
        $("#loginState").text("Login");
    } else {
        $("#loginText").text("Logged in as " + user.displayName);
        $("#loginState").text("Logout");
        $("#loginState").off("click");
        $("#loginState").click(function(_) {
            auth.signOut().catch(function(err) {
                console.log("An unexpected error occurred\nCode: " + err.code + "\nMessage: " + err.message);
            })
        });
    }
    //console.log(user);
    collection.doc(user.uid).get().then(function(doc) {
        if (!doc.exists) {
            collection.doc(user.uid).set({
                email: user.email,
                dispName: user.displayName,
                chips: startingChips
            })
        }
        userData = doc.data();
        localChips = userData.chips;
        updateData();
    }).catch(function(err) {
        console.log("An unexpected error occurred\nCode: " + err.code + "\nMessage: " + err.message);
    });
}).catch(function(err) {
    console.log("An unexpected error occurred\nCode: " + err.code + "\nMessage: " + err.message);
});
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
function blackJack(bet) {
    bet = Math.max(bet, 0);
    localChips -= bet;
    updateData();
    var cards = generateRandomCards();
    var currIndex = 0;
    var plrScore = 0;
    var cpuScore = 0;
    var plrBust = false;
    var cpuBust = false;
    for (var i = 0; i < 4; i++) {
        genCard(cards[currIndex], i < 2, i == 3);
        currIndex++;
        $("#dummyCard").text(parseInt(52 - currIndex));
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
        //console.log("Updated scores\nPlr: " + plrScore + "\nComp: " + cpuScore);
        return [plrScore, cpuScore];
    }
    function hit(plr) {
        genCard(cards[currIndex], plr, false);
        currIndex++;
        $("#dummyCard").text(parseInt(52 - currIndex));
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
                localChips += bet;
                updateData();
            } else if (plrBust) {
                $("#winner").text("You lose!");
            } else {
                $("#winner").text("You win!");
                localChips += bet * 2;
                updateData();
            }
        } else {
            if (scores[0] > scores[1]) {
                $("#winner").text("You win!");
                localChips += bet * 2;
                updateData();
            } else if (scores[0] < scores[1]) {
                $("#winner").text("You lose!");
            } else {
                $("#winner").text("Tie");
                localChips += bet;
                updateData();
            }
        }
        $("#hit").off("click");
        $("#hit").css("visibility", "visible");
        $("#bjBet").css("visibility", "visible");
        $("#hit").text("Restart");
        $("#hit").click(function() {
            if (!isNaN(parseInt($("#bjBet").val()))) {
                if (!(parseInt($("#bjBet").val()) > localChips)) {
                    reset();
                } else {
                    alert("You cannot bet more than you have");
                }
            } else {
                alert("Please enter a numeric bet amount to play Blackjack");
            }
        });
        $("#stand").off("click");
    }
    function reset() {
        $("#bjBet").css("visibility", "hidden");
        $("#stand").css("visibility", "visible");
        $("#hit").off("click");
        $("#hit").text("Hit");
        $("#plrCardArea").empty();
        $("#cpuCardArea").empty();
        $("#winner").text("");
        blackJack(parseInt($("#bjBet").val()));
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
    var reelIDs = [];
    var btnPressed;
    function startSpin() {
        reelIDs = [];
        activeReels = numReels;
        var spinRate = 0.5;
        var maxVariation = 3.0;
        $("#slotMachine div[id *= 'slotReel']").each(function(i) {
            var id = setInterval(function() {
                var obj = $("#slotMachine div[id = 'slotReel" + String(i + 1) + "']");
                obj.css("background-position-y", (parseInt(obj.css("background-position-y")) + (((spinRate + (parseInt(Math.random() * ((maxVariation * 100) + 1)) / 100)) * heightClamp) / updateRate)) % heightClamp);
            }, 1000 / updateRate);
            reelIDs[reelIDs.length] = id;
        })
        setTimeout(stopSpin, 1000 + parseInt(Math.random() * 4001));
        //console.log(reelIDs)
    }
    function stopSpin() {
        var delayBetweenStops = 0.5;
        window.clearInterval(reelIDs[numReels - activeReels]);
        var currReel = $("#slotMachine div[id = 'slotReel" + String((numReels + 1) - activeReels) + "']");
        var pos = parseInt(currReel.css("background-position-y"));
        var closest = 0;
        for (var i = 1; i < winZones.length; i++) {
            if (Math.abs(pos - winZones[i]) < Math.abs(pos - winZones[closest])) {
                closest = i % 6;
            }
        }
        currReel.attr("value", closest);
        currReel.css("background-position-y", winZones[closest]);
        //console.log(winZones[closest])
        activeReels--;
        if (activeReels > 0) {
            setTimeout(stopSpin, delayBetweenStops * 1000);
        } else {
            calcWin();
        }
    }
    function calcWin() {
        var stops = [0, 0, 0];
        var payTable = [50, 20, 30, 40, 75, 160];
        var payMult = [1, 3, 8, 16]
        var cherryTable = [5, 10];
        var payout = 0;
        $("#slotMachine div").each(function(i) {
            var obj = $("#slotMachine div[id = 'slotReel" + String(i + 1) + "']");
            stops[i] = parseInt(obj.attr("value"));
        });
        var lineMatch = (stops[0] == stops[1]) && (stops[1] == stops[2]) && (stops[0] == stops[2]);
        if (lineMatch) {
            payout = payTable[stops[0]];
        } else if (stops[0] == 1 && stops[1] == 1) {
            payout = cherryTable[1];
        } else if (stops[0] == 1) {
            payout = cherryTable[0];
        }
        payout *= payMult[btnPressed]
        localChips += payout;
        $("#slotMachine #payout").text("Payout: " + payout);
        updateData();
        //console.log(payout);
    }
    $("#slotMachine button[id *= 'betBtn']").click(function() {
        if (activeReels == 0) {
            if ((parseInt($(this).text().substring(4)) < localChips)) {
                btnPressed = parseInt($(this).attr("id").substring(6)) - 1;
                startSpin();
                localChips -= parseInt($(this).text().substring(4));
                updateData();
                $("#slotMachine #payout").text("Payout: 0");
            } else {
                alert("You do not have enough chips to bet that amount");
            }
        }
    })
}
blackJack(0);
slotMachine();