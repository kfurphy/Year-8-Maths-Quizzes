let currentQuestion = 0;
let score = 0;
let startTime;
let timerInterval;

// Inline questions for all topics
const quizzes = {
    equations: {
        title: "Solving Equations",
        questions: [
            { question: "Solve for x: 2x + 3 = 7", answer: "2" },
            { question: "Solve for x: x/2 = 4", answer: "8" },
            { question: "Solve for x: 3x - 5 = 10", answer: "5" },
            { question: "Solve for x: x + 6 = 11", answer: "5" },
            { question: "Solve for x: 5x = 25", answer: "5" }
        ]
    },
    straightline: {
        title: "Straight Line Graphs",
        questions: [
            { question: "What is the gradient of the line y = 2x + 3?", answer: "2" },
            { question: "What is the y-intercept of y = 4x + 1?", answer: "1" },
            { question: "If x = 2, what is y in y = 3x - 1?", answer: "5" },
            { question: "What is the gradient of a horizontal line?", answer: "0" },
            { question: "Find the y-intercept of y = -3x + 6.", answer: "6" }
        ]
    },
    probability: {
        title: "Probability",
        questions: [
            { question: "What is the probability of rolling a 4 on a fair die?", answer: "1/6" },
            { question: "What is the probability of getting heads when flipping a coin?", answer: "1/2" },
            { question: "A bag contains 3 red balls and 2 blue balls. What is the probability of picking a red ball?", answer: "3/5" },
            { question: "If two dice are rolled, what is the probability of getting a sum of 7?", answer: "1/6","6/36" },
            { question: "What is the probability of drawing a queen from a standard deck of 52 cards?", answer: "1/13","4,52" }
        ]
    },
    percentages: {
        title: "Percentages and Ratios",
        questions: [
            { question: "What is 50% of 40?", answer: "20" },
            { question: "What is the ratio of 4 to 8 in simplest form?", answer: "1:2" },
            { question: "Increase 60 by 25%.", answer: "75" },
            { question: "What is 20% of 200?", answer: "40" },
            { question: "Simplify the ratio 15:5.", answer: "3:1" }
        ]
    }
};

// Load the quiz
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");

    if (!quizzes[topic]) {
        alert("Quiz not found!");
        return;
    }

    const quizData = quizzes[topic];
    document.getElementById('quiz-title').textContent = quizData.title;

    // Show the first question
    showQuestion(quizData.questions[currentQuestion], quizData);
};

// Function to show a question
function showQuestion(question, quizData) {
    startTime = new Date();
    clearInterval(timerInterval); // Clear any previous timer
    startTimer(); // Start the countdown timer

    // Conditionally add "x=" based on quiz type
    const inputPrefix = quizData.title === "Solving Equations" ? "<p>x = " : "<p>";
    
    document.getElementById('question-container').innerHTML = `
        <p>${question.question}</p>
        ${inputPrefix}<input type="text" id="answer" placeholder="Enter your answer here" /></p>
        <button id="next-btn">Next</button>
    `;

    // Add event listener to the "Next" button
    document.getElementById('next-btn').onclick = () => checkAnswer(quizData);
}

// Timer function
function startTimer() {
    let timeRemaining = 30;
    document.getElementById('timer').textContent = `Time remaining: ${timeRemaining}s`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').textContent = `Time remaining: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            nextQuestion(false); // Move to the next question when time runs out
        }
    }, 1000);
}

function checkAnswer(quizData) {
    const userAnswer = document.getElementById('answer').value.trim();
    const current = quizData.questions[currentQuestion];

    // Normalize answers: allow 6/36 to be treated as 1/6
    const normalizedUserAnswer = userAnswer.replace(/\s+/g, "").toLowerCase(); // Remove spaces and lowercase for comparison
    const normalizedCorrectAnswers = Array.isArray(current.answer) ? current.answer.map(ans => ans.replace(/\s+/g, "").toLowerCase()) : [current.answer.replace(/\s+/g, "").toLowerCase()];

    // Check if the normalized answer matches any of the correct answers
    if (normalizedCorrectAnswers.includes(normalizedUserAnswer)) {
        const timeTaken = (new Date() - startTime) / 1000; // seconds
        score += Math.max(30 - timeTaken, 0); // Award more points for faster answers
    }

    nextQuestion(true, quizData); // Move to the next question after checking the answer
}


// Function to handle moving to the next question
function nextQuestion(manualAdvance, quizData) {
    clearInterval(timerInterval); // Stop the timer

    currentQuestion++;

    if (currentQuestion >= quizData.questions.length) {
        endQuiz(quizData.title);
    } else {
        showQuestion(quizData.questions[currentQuestion], quizData);
    }
}

// Function to end the quiz
function endQuiz(quizTitle) {
    clearInterval(timerInterval); // Stop the timer
    document.getElementById('quiz-container').style.display = "none";
    document.getElementById('results-container').style.display = "block";
    document.getElementById('score').textContent = `Your final score: ${Math.round(score)}`;

    // Store the score for this specific quiz
    const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    scores[quizTitle] = Math.round(score);
    localStorage.setItem('quizScores', JSON.stringify(scores));

    document.getElementById('results-container').innerHTML += `
        <button onclick="window.location.href='index.html';">Return to Main Screen</button>
    `;
}
