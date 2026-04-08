/*
Punktebewertung: easy = 1, medium = 2, hard = 3, falsch = 0
*/
function getPoints(difficulty, isCorrect) {
    if (!isCorrect)
        return 0;
    if (difficulty === "easy")
        return 1;
    else if (difficulty === "medium")
        return 2;
    return 3;
}
function getMaxPoints(questions) {
    let maxPoints = 0;
    questions.forEach(question => {
        maxPoints += getPoints(question.difficulty, true);
    });
    return maxPoints;
}
export function calculateResult(playerName, questions, userAnswers) {
    let points = 0;
    let correctAnswers = 0;
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].answer === userAnswers[i]) {
            points += getPoints(questions[i].difficulty, true);
            correctAnswers++;
        }
    }
    const maxPoints = getMaxPoints(questions);
    const percentage = (points / maxPoints) * 100;
    return { playerName, points, maxPoints, percentage, correctAnswers }; //PlayerResult Objekt
}
export function saveResult(result) {
    const results = loadResults();
    results.push(result);
    localStorage.setItem("quizResults", JSON.stringify(results));
}
export function loadResults() {
    const storedResults = localStorage.getItem("quizResults");
    if (!storedResults) {
        return [];
    }
    return JSON.parse(storedResults);
}
