export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  category: string;
  question: string;
  options: (string | number)[];
  answer: string | number;
  difficulty: Difficulty;
}

/**
 * die Array wird gemischt
 */
function shuffle<T>(array: T[]): T[] {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

/**
 * questions.json durch fetch einlesen
 */
export async function loadQuestions(): Promise<Question[]> {
  const response = await fetch("./questions.json");

  if (!response.ok) {
    throw new Error("Failed to load questions.json");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid questions data: expected an array");
  }

  const questions = data as Question[];

  if (questions.length < 30) {
    throw new Error("Question pool must contain at least 30 questions");
  }

  return questions;
}

/**
 * Fragen nach dem Niveau teilen
 */
function groupByDifficulty(questions: Question[]) {
  return {
    easy: questions.filter((q) => q.difficulty === "easy"),
    medium: questions.filter((q) => q.difficulty === "medium"),
    hard: questions.filter((q) => q.difficulty === "hard"),
  };
}

/**
 * 5 Fragen zurückgeben
 * 1人分の問題を5問返す
 * Easy 2問, Medium 2問, Hard 1問
 */
export function getQuestionsForPlayer(allQuestions: Question[]): Question[] {
  const { easy, medium, hard } = groupByDifficulty(allQuestions);

  if (easy.length < 2 || medium.length < 2 || hard.length < 1) {
    throw new Error("Not enough questions for each difficulty level");
  }

  const selectedEasy = shuffle(easy).slice(0, 2);
  const selectedMedium = shuffle(medium).slice(0, 2);
  const selectedHard = shuffle(hard).slice(0, 1);

  return shuffle([...selectedEasy, ...selectedMedium, ...selectedHard]);
}