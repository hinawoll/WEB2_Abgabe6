/*
Punktebewertung: easy = 1, medium = 2, hard = 3, falsch = 0
*/

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: Difficulty;
}

export interface PlayerResult {
  playerName: string;
  points: number;
  maxPoints: number;
  percentage: number;
  correctAnswers: number;
}

function getPoints(difficulty: Difficulty, isCorrect: boolean): number {
  if(!isCorrect) return 0;
  if(difficulty === "easy") return 1;
  else if(difficulty === "medium") return 2;
  return 3;
}

function getMaxPoints(questions: Question[]): number {
  let maxPoints: number = 0;
  questions.forEach(question => {
    maxPoints += getPoints(question.difficulty, true);
  });
  return maxPoints;
}

export function calculateResult(playerName: string, questions: Question[], userAnswers: string[]): PlayerResult {
  let points: number = 0;
  let correctAnswers: number = 0;
  for(let i: number = 0; i < questions.length; i++){
    if(questions[i].answer === userAnswers[i]){
      points += getPoints(questions[i].difficulty, true);
      correctAnswers++;
    }
  }
  const maxPoints: number = getMaxPoints(questions);
  const percentage: number = (points/maxPoints) * 100
  return {playerName, points, maxPoints, percentage, correctAnswers}; //PlayerResult Objekt
}

export function saveResult(result: PlayerResult): void {
  const results = loadResults();
  results.push(result);
  localStorage.setItem("quizResults", JSON.stringify(results));
}

export function loadResults(): PlayerResult[] {
  const storedResults = localStorage.getItem("quizResults");
  if (!storedResults) {
    return [];
  }
  return JSON.parse(storedResults) as PlayerResult[];
}