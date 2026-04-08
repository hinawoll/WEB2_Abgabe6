/**
 * die Array wird gemischt
 */
function shuffle(array) {
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
export async function loadQuestions() {
    const response = await fetch("./questions.json");
    if (!response.ok) {
        throw new Error("Failed to load questions.json");
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Invalid questions data: expected an array");
    }
    const questions = data;
    if (questions.length < 30) {
        throw new Error("Question pool must contain at least 30 questions");
    }
    return questions;
}
/**
 * Fragen nach dem Niveau teilen
 */
function groupByDifficulty(questions) {
    return {
        easy: questions.filter((q) => q.difficulty === "easy"),
        medium: questions.filter((q) => q.difficulty === "medium"),
        hard: questions.filter((q) => q.difficulty === "hard"),
    };
}
/**
 * 5 Fragen zurückgeben
 * Easy :2, Medium :2, Hard :1
 */
export function getQuestionsForPlayer(allQuestions) {
    const { easy, medium, hard } = groupByDifficulty(allQuestions);
    if (easy.length < 2 || medium.length < 2 || hard.length < 1) {
        throw new Error("Not enough questions for each difficulty level");
    }
    const selectedEasy = shuffle(easy).slice(0, 2);
    const selectedMedium = shuffle(medium).slice(0, 2);
    const selectedHard = shuffle(hard).slice(0, 1);
    return shuffle([...selectedEasy, ...selectedMedium, ...selectedHard]);
}
