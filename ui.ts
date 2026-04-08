export interface Question {
  category: string;
  question: string;
  options: (string | number)[];
  answer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
}

import { fetchQuestions, Question } from './questions.js';
import { calculateScore } from './scoring.js';

let questions: Question[] = [];
let answers: (string|number)[] = [];
let indexcount: number = 0;
questions = await fetchQuestions();
let playerName: string = "";

async function initQuiz() {
    questions = await fetchQuestions();

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
        handleAnswer(index, option);
    });

    document.getElementById("options")!.appendChild(Option);
  });
}

function handleAnswer(index: number, selectedOption: string | number): void {
    answers[index] = selectedOption;

    indexcount++;

    if (indexcount < questions.length) {
        displayQuestion(indexcount);
    } 
    else 
    {
        const score = calculateScore(questions, answers);
        displayScore(score.categoryScores, score.totalScore, score.totalPoints, score.maxPoints);
    }
}

function displayScore(categoryScores: { [category: string]: { correct: number; total: number; points: number; } }, totalScore: number, totalPoints: number, maxPoints: number): void {
    
    document.getElementById("quiz-container")!.style.display = "none";
    for (const category in categoryScores) {
        const c = categoryScores[category] as { correct: number; total: number; points: number };
        const listelement = document.createElement("li");
        listelement.textContent = category + ": " + c.correct + "/" + c.total + " (" + c.points + " pts)";
        document.getElementById("points")!.appendChild(listelement);
    }
    const leaderboard = document.getElementById("leaderboard")!;
    const entry = document.createElement("li");
    entry.textContent = `${playerName}: ${totalScore}/${maxPoints} pts`;
    leaderboard.appendChild(entry);
}