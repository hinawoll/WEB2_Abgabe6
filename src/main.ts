import { loadQuestions, getQuestionsForPlayer} from './questions.js';
import { calculateScore, saveResult, PlayerResult, loadResults, Question} from "./module2.js";

let questions: Question[] = [];
let answers: string[] = [];
let indexcount: number = 0;
let playerName: string = "";

async function initQuiz(): Promise<void>{
    questions = getQuestionsForPlayer(await loadQuestions());
    document.getElementById("startBtn")!.addEventListener("click", () => {
        const input = document.getElementById("username") as HTMLInputElement;
        if (input.value.trim() === "") {
        return;
        }
        playerName = input.value.trim();  
        document.getElementById("player-input")!.style.display = "none";
        document.getElementById("quiz-container")!.style.display = "block";
        
        displayQuestion(indexcount);  
    });
}
initQuiz();

export function displayQuestion(index: number): void {
    let question = questions[index];
    document.getElementById("question")!.textContent = question.question;
    document.getElementById("options")!.innerHTML = "";
    question.options.forEach((option: string | number)  => {
    const Option = document.createElement("button");
    Option.className = "btn btn-outline-primary btn-block mt-2";
    Option.textContent = option.toString();

    Option.addEventListener("click", () => {
        handleAnswer(index, option.toString());
    });

    document.getElementById("options")!.appendChild(Option);
  });
}

function handleAnswer(index: number, selectedOption: string): void {
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
}

  function displayScore(result: PlayerResult) {
  const pointsList = document.getElementById("points")!;
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

  const leaderboard = document.getElementById("leaderboard")!;
  leaderboard.innerHTML = "";
  saveResult(result); 
  const allResults = loadResults();
  allResults.forEach((res: PlayerResult) => {
      const li = document.createElement("li");
      li.textContent = res.playerName + ": " + res.points + "/" + res.maxPoints + " pts";
      leaderboard.appendChild(li);
  });
}
