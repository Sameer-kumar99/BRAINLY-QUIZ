// Quiz questions array
const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Rome", correct: false },
            { text: "Berlin", correct: false }
        ]
    },
    {
        question: "Which language runs in a web browser?",
        answers: [
            { text: "Java", correct: false },
            { text: "C", correct: false },
            { text: "Python", correct: false },
            { text: "JavaScript", correct: true }
        ]
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: [
            { text: "Saturn", correct: false },
            { text: "Jupiter", correct: true },
            { text: "Neptune", correct: false },
            { text: "Earth", correct: false }
        ]
    },
    {
        question: "Which of these is not a programming language?",
        answers: [
            { text: "Ruby", correct: false },
            { text: "HTML", correct: true },
            { text: "Swift", correct: false },
            { text: "Rust", correct: false }
        ]
    },
    {
        question: "Which company developed the first commercially available smartphone?",
        answers: [
            { text: "Apple", correct: false },
            { text: "Samsung", correct: false },
            { text: "IBM", correct: true },
            { text: "Nokia", correct: false }
        ]
    }
    // Add more questions as needed
];

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreMessageElement = document.getElementById('score-message');
const resultsSummaryElement = document.getElementById('results-summary');
const restartButton = document.getElementById('restart-btn');
const progressIndicator = document.getElementById('progress-indicator');
const questionNumberElement = document.getElementById('question-number');
const timerElement = document.getElementById('timer');

// Variables to track quiz state
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // Array to store user answers
let timerInterval = null;
let timeLeft = 10; // Time in seconds for each question

// Event listeners
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', startQuiz);

// Function to start the quiz
function startQuiz() {
    // Reset state
    welcomeScreen.classList.add('hide');
    resultsContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    score = 0;
    userAnswers = [];
    
    // Shuffle questions
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    
    // Update total questions
    totalQuestionsElement.textContent = shuffledQuestions.length;
    
    // Display first question
    setNextQuestion();
}

// Function to set up the next question
function setNextQuestion() {
    resetState();
    updateProgressBar();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    startTimer();
}

// Function to start the timer
function startTimer() {
    timeLeft = 10;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeExpired();
        }
    }, 1000);
}

// Function to update timer display
function updateTimerDisplay() {
    timerElement.textContent = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
    
    // Visual indication as time runs low
    if (timeLeft <= 3) {
        timerElement.style.color = 'red';
    } else {
        timerElement.style.color = '#666';
    }
}

// Function called when time expires
function timeExpired() {
    // Record that this question was skipped due to time
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const userAnswer = {
        question: currentQuestion.question,
        userSelection: "No answer (time expired)",
        correctAnswer: currentQuestion.answers.find(a => a.correct).text,
        isCorrect: false,
        timeExpired: true
    };
    userAnswers.push(userAnswer);
    
    // Show correct answer briefly
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add('disabled');
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
    });
    
    // Wait briefly then move to next question
    setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            currentQuestionIndex++;
            setNextQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Function to update progress bar
function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
    progressIndicator.style.width = `${progressPercentage}%`;
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
}

// Function to reset the state between questions
function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// Function to display the current question
function showQuestion(question) {
    questionElement.textContent = question.question;
    
    // Shuffle answers
    const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
    
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('btn');
        button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// Function to handle when a user selects an answer
function selectAnswer(e) {
    // Stop the timer
    clearInterval(timerInterval);
    
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    
    // Record user answer
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const userAnswer = {
        question: currentQuestion.question,
        userSelection: selectedButton.textContent,
        correctAnswer: currentQuestion.answers.find(a => a.correct).text,
        isCorrect: correct,
        timeExpired: false
    };
    userAnswers.push(userAnswer);
    
    // Update score if correct
    if (correct) {
        score++;
    }
    
    // Mark the button as correct or wrong
    setStatusClass(selectedButton, correct);
    
    // Disable all buttons after selection
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add('disabled');
        button.removeEventListener('click', selectAnswer);
        
        // Show which one was the correct answer
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
    });
    
    // Show next button or end quiz
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(showResults, 1000); // Show results after a short delay
    }
}

// Function to set the status class for correct/wrong answers
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

// Function to clear status classes
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Function to show quiz results
function showResults() {
    // Clear any active timer
    clearInterval(timerInterval);
    
    questionContainer.classList.add('hide');
    resultsContainer.classList.remove('hide');
    
    // Display score
    scoreElement.textContent = score;
    
    // Calculate percentage and show message
    const percentage = (score / shuffledQuestions.length) * 100;
    let message;
    
    if (percentage >= 90) {
        message = "Excellent! You've mastered this quiz!";
    } else if (percentage >= 70) {
        message = "Great job! You know your stuff!";
    } else if (percentage >= 50) {
        message = "Good effort! You're on the right track.";
    } else {
        message = "Keep practicing, you'll improve!";
    }
    
    scoreMessageElement.textContent = message;
    
    // Generate results summary
    generateResultsSummary();
}

// Function to generate the results summary
function generateResultsSummary() {
    resultsSummaryElement.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        
        const questionText = document.createElement('div');
        questionText.classList.add('result-question');
        questionText.textContent = `${index + 1}. ${answer.question}`;
        
        const userAnswerDiv = document.createElement('div');
        userAnswerDiv.classList.add('result-answer');
        
        if (answer.timeExpired) {
            userAnswerDiv.classList.add('user-answer');
            userAnswerDiv.textContent = `Your answer: No answer (time expired) ✗`;
            
            const correctAnswerDiv = document.createElement('div');
            correctAnswerDiv.classList.add('result-answer', 'correct-answer');
            correctAnswerDiv.textContent = `Correct answer: ${answer.correctAnswer}`;
            
            resultItem.appendChild(questionText);
            resultItem.appendChild(userAnswerDiv);
            resultItem.appendChild(correctAnswerDiv);
            resultsSummaryElement.appendChild(resultItem);
            return;
        }
        
        if (answer.isCorrect) {
            userAnswerDiv.classList.add('user-correct');
            userAnswerDiv.textContent = `Your answer: ${answer.userSelection} ✓`;
        } else {
            userAnswerDiv.classList.add('user-answer');
            userAnswerDiv.textContent = `Your answer: ${answer.userSelection} ✗`;
            
            const correctAnswerDiv = document.createElement('div');
            correctAnswerDiv.classList.add('result-answer', 'correct-answer');
            correctAnswerDiv.textContent = `Correct answer: ${answer.correctAnswer}`;
            
            resultItem.appendChild(questionText);
            resultItem.appendChild(userAnswerDiv);
            resultItem.appendChild(correctAnswerDiv);
            resultsSummaryElement.appendChild(resultItem);
            return;
        }
        
        resultItem.appendChild(questionText);
        resultItem.appendChild(userAnswerDiv);
        resultsSummaryElement.appendChild(resultItem);
    });
}