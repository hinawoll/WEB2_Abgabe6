"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayQuestion = displayQuestion;
var questions_js_1 = require("./questions.js");
var module2_js_1 = require("./module2.js");
var questions = [];
var answers = [];
var indexcount = 0;
questions = (0, questions_js_1.getQuestionsForPlayer)(await (0, questions_js_1.loadQuestions)());
var playerName = "";
function initQuiz() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = questions_js_1.getQuestionsForPlayer;
                    return [4 /*yield*/, (0, questions_js_1.loadQuestions)()];
                case 1:
                    questions = questions = _a.apply(void 0, [_b.sent()]);
                    document.getElementById("startBtn").addEventListener("click", function () {
                        var input = document.getElementById("username");
                        if (input.value.trim() === "") {
                            return;
                        }
                        playerName = input.value.trim();
                        document.getElementById("player-input").style.display = "none";
                        document.getElementById("quiz-container").style.display = "block";
                        displayQuestion(indexcount);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
initQuiz();
function displayQuestion(index) {
    var question = questions[index];
    document.getElementById("question").textContent = question.question;
    document.getElementById("options").innerHTML = "";
    question.options.forEach(function (option) {
        var Option = document.createElement("button");
        Option.className = "btn btn-outline-primary btn-block mt-2";
        Option.textContent = option.toString();
        Option.addEventListener("click", function () {
            handleAnswer(index, option);
        });
        document.getElementById("options").appendChild(Option);
    });
}
function handleAnswer(index, selectedOption) {
    answers[index] = selectedOption.toString();
    indexcount++;
    if (indexcount < questions.length) {
        displayQuestion(indexcount);
    }
    else {
        var result = (0, module2_js_1.calculateScore)(playerName, questions, answers);
        displayScore(result);
    }
}
function displayScore(result) {
    var pointsList = document.getElementById("points");
    pointsList.innerHTML = "";
    var li1 = document.createElement("li");
    li1.textContent = result.playerName + ": " + result.correctAnswers + "/" + questions.length + " correct";
    pointsList.appendChild(li1);
    var li2 = document.createElement("li");
    li2.textContent = "Points: " + result.points + "/" + result.maxPoints;
    pointsList.appendChild(li2);
    var li3 = document.createElement("li");
    li3.textContent = "Percentage: " + result.percentage.toFixed(1) + "%";
    pointsList.appendChild(li3);
    var leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    (0, module2_js_1.saveResult)(result);
    var allResults = (0, module2_js_1.loadResults)();
    allResults.forEach(function (res) {
        var li = document.createElement("li");
        li.textContent = res.playerName + ": " + res.points + "/" + res.maxPoints + " pts";
        leaderboard.appendChild(li);
    });
}
