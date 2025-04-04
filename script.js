
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

];


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


let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; 
let timerInterval = null;
let timeLeft = 10;


startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', startQuiz);


function startQuiz() {
    // Reset state
    welcomeScreen.classList.add('hide');
    resultsContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    score = 0;
    userAnswers = [];
    
    
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    
   
    totalQuestionsElement.textContent = shuffledQuestions.length;
    
    
    setNextQuestion();
}


function setNextQuestion() {
    resetState();
    updateProgressBar();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    startTimer();
}


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


function updateTimerDisplay() {
    timerElement.textContent = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
    
    
    if (timeLeft <= 3) {
        timerElement.style.color = 'red';
    } else {
        timerElement.style.color = '#666';
    }
}


function timeExpired() {
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const userAnswer = {
        question: currentQuestion.question,
        userSelection: "No answer (time expired)",
        correctAnswer: currentQuestion.answers.find(a => a.correct).text,
        isCorrect: false,
        timeExpired: true
    };
    userAnswers.push(userAnswer);
    
    
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add('disabled');
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
    });
    
    
    setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            currentQuestionIndex++;
            setNextQuestion();
        } else {
            showResults();
        }
    }, 1500);
}


function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
    progressIndicator.style.width = `${progressPercentage}%`;
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
}


function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}


function showQuestion(question) {
    questionElement.textContent = question.question;
    
    
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


function selectAnswer(e) {
    
    clearInterval(timerInterval);
    
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const userAnswer = {
        question: currentQuestion.question,
        userSelection: selectedButton.textContent,
        correctAnswer: currentQuestion.answers.find(a => a.correct).text,
        isCorrect: correct,
        timeExpired: false
    };
    userAnswers.push(userAnswer);
    
    
    if (correct) {
        score++;
    }
    
    
    setStatusClass(selectedButton, correct);
    
    
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add('disabled');
        button.removeEventListener('click', selectAnswer);
        
        
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
    });
    
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(showResults, 1000); 
    }
}


function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}


function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}


function showResults() {
    
    clearInterval(timerInterval);
    
    questionContainer.classList.add('hide');
    resultsContainer.classList.remove('hide');
    
    
    scoreElement.textContent = score;
    

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
    
    
    generateResultsSummary();
}


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
