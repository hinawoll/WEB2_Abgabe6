import { loadQuestions, getQuestionsForPlayer } from './questions.js';
import { calculateScore, saveResult, loadResults } from "./module2.js";
let questions = [];
let answers = [];
let indexcount = 0;
let playerName = "";
async function restartGame() {
    indexcount = 0;
    answers = [];
    questions = getQuestionsForPlayer(await loadQuestions());
    document.getElementById("points").innerHTML = "";
    document.getElementById("leaderboard").innerHTML = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("question").textContent = "";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("player-input").style.display = "block";
    document.getElementById("restartBtn").style.display = "none";
    const input = document.getElementById("username");
    input.value = "";
}
async function initQuiz() {
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    questions = getQuestionsForPlayer(await loadQuestions());
    document.getElementById("startBtn").addEventListener("click", () => {
        const input = document.getElementById("username");
        if (input.value.trim() === "") {
            return;
        }
        playerName = input.value.trim();
        document.getElementById("player-input").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";
        displayQuestion(indexcount);
    });
}
initQuiz();
export function displayQuestion(index) {
    let question = questions[index];
    document.getElementById("question").textContent = question.question;
    document.getElementById("options").innerHTML = "";
    question.options.forEach((option) => {
        const Option = document.createElement("button");
        Option.className = "btn btn-outline-primary btn-block mt-2";
        Option.textContent = option.toString();
        Option.addEventListener("click", () => {
            handleAnswer(index, option.toString(), Option);
        });
        document.getElementById("options").appendChild(Option);
    });
}
/*function handleAnswer(index: number, selectedOption: string, button: HTMLButtonElement): void {
    answers[index] = selectedOption.toString();

    indexcount++;

    if (indexcount < questions.length) {
        displayQuestion(indexcount);
    }
    else
    {
        const result = calculateScore(playerName, questions, answers);
        displayScore(result);
    }
}*/
function handleAnswer(index, selectedOption, button) {
    document.querySelectorAll("#options button").forEach(btn => {
        btn.disabled = true;
    }); //keine weiteren buttons drückbar während feedback
    answers[index] = selectedOption;
    const isCorrect = questions[index].answer === selectedOption;
    if (isCorrect) {
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-success");
    }
    else {
        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-danger");
    }
    setTimeout(() => {
        indexcount++;
        if (indexcount < questions.length) {
            displayQuestion(indexcount);
        }
        else {
            const result = calculateScore(playerName, questions, answers);
            displayScore(result);
        }
    }, 1200);
}
function displayScore(result) {
    const pointsList = document.getElementById("points");
    pointsList.innerHTML = "";
    const li1 = document.createElement("li");
    li1.textContent = result.playerName + ": " + result.correctAnswers + "/" + questions.length + " correct";
    pointsList.appendChild(li1);
    const li2 = document.createElement("li");
    li2.textContent = "Points: " + result.points + "/" + result.maxPoints;
    pointsList.appendChild(li2);
    const li3 = document.createElement("li");
    li3.textContent = "Percentage: " + result.percentage.toFixed(1) + "%";
    pointsList.appendChild(li3);
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    saveResult(result);
    const allResults = loadResults().sort((a, b) => b.points - a.points).slice(0, 5); //nur die besten 5
    allResults.forEach((res) => {
        const li = document.createElement("li");
        li.textContent = res.playerName + ": " + res.points + "/" + res.maxPoints + " pts";
        leaderboard.appendChild(li);
    });
    document.getElementById("restartBtn").style.display = "block";
}
