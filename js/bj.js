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
function drawCard(cardNum, hidden) {
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
    var id = (hidden ? "card-hidden" : "card") + (cardVals[1] < 2 ? "" : "-red");
    $("#plrCardArea").append("<div id = '" + id + "'><span id = 'numL'>" + numLetter + "</span><span id = 'suit'>" + suitSymbols[cardVals[1]] + "</span><span id = 'numR'>" + numLetter + "</span></div>");
}
drawCard(0, false);
drawCard(13, false);
drawCard(26, false);
drawCard(39, false);
drawCard(21, false);
drawCard(36, false);
drawCard(44, true)
drawCard(9, true)