const axios = require("axios");
const rand = require("random-seed").create();
require("dotenv").config();

function getArray() {
    var array = [];
    for (var i = 0; i < 12; i++) {
        array.push(getRandomInt(5 * i + 1, 5 * (i + 1) + 1));
    }
    return array;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
module.exports = {
    StartSignal: async (req, res) => {
        const { userName, betAmount, token, amount } = req.body;
        var betValue = parseFloat(betAmount);
        var amountValue = parseFloat(amount);
        let user = [];
        user[token] = {
            userName: userName,
            betAmount: betValue,
            userToken: token,
            amount: amountValue,
        };
        try {
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: user[token].userToken,
                        amount: user[token].betAmount,
                    }
                );
            } catch (err) {
                throw new Error("Bet Error!");
            }
            var pit = getArray();
            var total = user[token].amount - user[token].betAmount;
            try {
                res.json({
                    pitArray: pit,
                    total: total,
                    serverMsg: "Success",
                });
            } catch (err) {
                throw new Error("Can't find Server!");
            }
        } catch (err) {
            res.json({
                serverMsg: err.message,
            });
        }
    },
    GameResult: async (req, res) => {
        const { userName, betAmount, token, amount, cases } = req.body;
        var betValue = parseFloat(betAmount);
        var amountValue = parseFloat(amount);
        var cal = parseFloat(cases);
        let user = [];
        user[token] = {
            userName: userName,
            betAmount: betValue,
            userToken: token,
            amount: amountValue,
            cases: cal,
        };
        try {
            var raisePrice = user[token].betAmount * user[token].cases;
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/winlose",
                    {
                        token: user[token].userToken,
                        amount: raisePrice,
                        winState: raisePrice != 0 ? true : false,
                    }
                );
            } catch (err) {
                throw new Error("WinLose Error!");
            }
            var total = user[token].amount + raisePrice;
            var msg = "You win! ->" + "+" + raisePrice.toFixed(3);
            try {
                res.json({
                    total: total,
                    raisePrice: raisePrice,
                    msg: msg,
                    serverMsg: "Success",
                });
            } catch (err) {
                throw new Error("Can't find Server!");
            }
        } catch (err) {
            res.json({
                serverMsg: err.message,
            });
        }
    },
};
