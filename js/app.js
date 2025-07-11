class CalculationGame {
  constructor() {
    this.currentQuestion = null;
    this.startTime = null;
    this.timerInterval = null;
    this.correctAnswer = null;
    this.countdownActive = false;
    
    // New scoring properties
    this.totalQuestions = 10;
    this.currentQuestionNumber = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.allTimes = [];
    
    this.motivationalQuotes = [
      "Numbers are the music of reason!",
      "Every calculation makes you stronger!",
      "Math is the language of the universe!",
      "Practice makes perfect calculations!",
      "Your brain is a powerful calculator!",
      "Mental math builds mental strength!",
      "Think fast, calculate faster!",
      "Numbers don't lie, trust your mind!",
      "Mathematics is the poetry of logical ideas!",
      "Challenge your mind, embrace the numbers!"
    ];
    
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    // Settings elements
    this.min1Input = document.getElementById('min1');
    this.max1Input = document.getElementById('max1');
    this.min2Input = document.getElementById('min2');
    this.max2Input = document.getElementById('max2');
    this.operationSelect = document.getElementById('operation');
    this.questionCountInput = document.getElementById('questionCount');
    this.startBtn = document.getElementById('startBtn');
    
    // Game elements
    this.settingsSection = document.getElementById('settings');
    this.gameSection = document.getElementById('game');
    this.resultsSection = document.getElementById('results');
    this.currentQuestionSpan = document.getElementById('currentQuestion');
    this.totalQuestionsSpan = document.getElementById('totalQuestions');
    this.currentScoreSpan = document.getElementById('currentScore');
    this.progressFill = document.getElementById('progressFill');
    this.countdownSection = document.getElementById('countdown');
    this.countdownNumber = document.getElementById('countdownNumber');
    this.countdownQuote = document.getElementById('countdownQuote');
    this.questionDisplay = document.getElementById('question');
    this.timerDisplay = document.getElementById('timer');
    this.answerInput = document.getElementById('answerInput');
    this.submitBtn = document.getElementById('submitBtn');
    this.feedback = document.getElementById('feedback');
    this.nextBtn = document.getElementById('nextBtn');
    this.backBtn = document.getElementById('backBtn');
    
    // Results elements
    this.finalScore = document.getElementById('finalScore');
    this.finalTotal = document.getElementById('finalTotal');
    this.scorePercentage = document.getElementById('scorePercentage');
    this.correctCount = document.getElementById('correctCount');
    this.wrongCount = document.getElementById('wrongCount');
    this.averageTime = document.getElementById('averageTime');
    this.performanceMessage = document.getElementById('performanceMessage');
    this.restartBtn = document.getElementById('restartBtn');
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.startGame());
    this.submitBtn.addEventListener('click', () => this.submitAnswer());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.backBtn.addEventListener('click', () => this.backToSettings());
    this.restartBtn.addEventListener('click', () => this.backToSettings());
    
    this.answerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.submitAnswer();
      }
    });
  }

  startGame() {
    if (!this.validateInputs()) return;
    
    // Initialize game state
    this.totalQuestions = parseInt(this.questionCountInput.value);
    this.currentQuestionNumber = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.allTimes = [];
    
    // Update UI
    this.totalQuestionsSpan.textContent = this.totalQuestions;
    this.currentScoreSpan.textContent = '0';
    this.updateProgress();
    
    this.settingsSection.style.display = 'none';
    this.gameSection.style.display = 'block';
    this.resultsSection.style.display = 'none';
    this.generateQuestion();
  }

  validateInputs() {
    const min1 = parseInt(this.min1Input.value);
    const max1 = parseInt(this.max1Input.value);
    const min2 = parseInt(this.min2Input.value);
    const max2 = parseInt(this.max2Input.value);
    const questionCount = parseInt(this.questionCountInput.value);

    if (min1 > max1 || min2 > max2) {
      alert('Minimum values cannot be greater than maximum values!');
      return false;
    }

    if (min1 < 1 || min2 < 1) {
      alert('Minimum values must be at least 1!');
      return false;
    }

    if (questionCount < 1 || questionCount > 50) {
      alert('Number of questions must be between 1 and 50!');
      return false;
    }

    return true;
  }

  updateProgress() {
    const progressPercent = (this.currentQuestionNumber / this.totalQuestions) * 100;
    this.progressFill.style.width = `${progressPercent}%`;
    this.currentQuestionSpan.textContent = this.currentQuestionNumber + 1;
    this.currentScoreSpan.textContent = this.correctAnswers;
  }

  nextQuestion() {
    this.currentQuestionNumber++;
    
    if (this.currentQuestionNumber >= this.totalQuestions) {
      this.showResults();
    } else {
      this.updateProgress();
      this.generateQuestion();
    }
  }

  generateQuestion() {
    if (this.countdownActive) return;
    
    this.showCountdown(() => {
      this.createQuestion();
    });
  }

  showCountdown(callback) {
    this.countdownActive = true;
    this.countdownSection.style.display = 'block';
    this.questionDisplay.parentElement.style.display = 'none';
    
    // Show random motivational quote
    const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
    this.countdownQuote.textContent = randomQuote;
    
    let count = 3;
    this.countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdownNumber.textContent = count;
        // Trigger animation by removing and re-adding class
        this.countdownNumber.style.animation = 'none';
        setTimeout(() => {
          this.countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
        }, 10);
      } else {
        clearInterval(countdownInterval);
        this.countdownSection.style.display = 'none';
        this.questionDisplay.parentElement.style.display = 'block';
        this.countdownActive = false;
        callback();
      }
    }, 1000);
  }

  createQuestion() {
    const min1 = parseInt(this.min1Input.value);
    const max1 = parseInt(this.max1Input.value);
    const min2 = parseInt(this.min2Input.value);
    const max2 = parseInt(this.max2Input.value);
    const operation = this.operationSelect.value;

    let num1 = this.getRandomNumber(min1, max1);
    let num2 = this.getRandomNumber(min2, max2);

    // For division, ensure first number is bigger than second
    if (operation === '/') {
      if (num2 === 0) num2 = 1;
      
      // Swap if num2 is bigger than num1
      if (num2 > num1) {
        [num1, num2] = [num2, num1];
      }
      
      // For cleaner division problems, sometimes use factors
      if (Math.random() < 0.3) {
        num2 = this.getRandomNumber(1, Math.min(10, num1));
        const quotient = this.getRandomNumber(1, 20);
        const newNum1 = num2 * quotient;
        if (newNum1 >= Math.min(min1, min2) && newNum1 <= Math.max(max1, max2)) {
          this.currentQuestion = { num1: newNum1, num2, operation };
          this.correctAnswer = quotient;
        } else {
          this.currentQuestion = { num1, num2, operation };
          this.correctAnswer = this.roundToDecimal(num1 / num2, 2);
        }
      } else {
        this.currentQuestion = { num1, num2, operation };
        this.correctAnswer = this.roundToDecimal(num1 / num2, 2);
      }
    } else {
      this.currentQuestion = { num1, num2, operation };
      this.correctAnswer = this.calculateAnswer(num1, num2, operation);
    }

    this.displayQuestion();
    this.startTimer();
    this.resetAnswerSection();
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calculateAnswer(num1, num2, operation) {
    switch (operation) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return this.roundToDecimal(num1 / num2, 2);
      default: return 0;
    }
  }

  roundToDecimal(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  displayQuestion() {
    const { num1, num2, operation } = this.currentQuestion;
    let operatorSymbol = operation;
    
    switch (operation) {
      case '*': operatorSymbol = '×'; break;
      case '/': operatorSymbol = '÷'; break;
      case '-': operatorSymbol = '−'; break;
    }
    
    this.questionDisplay.textContent = `${num1} ${operatorSymbol} ${num2}`;
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      this.timerDisplay.textContent = `${elapsed.toFixed(1)}s`;
    }, 100);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    return (Date.now() - this.startTime) / 1000;
  }

  submitAnswer() {
    if (!this.currentQuestion || !this.startTime) return;
    
    const userAnswer = parseFloat(this.answerInput.value);
    const timeTaken = this.stopTimer();
    
    if (isNaN(userAnswer)) {
      alert('Please enter a valid number!');
      this.startTimer(); // Restart timer
      return;
    }

    this.allTimes.push(timeTaken);
    const isCorrect = this.checkAnswer(userAnswer);
    
    if (isCorrect) {
      this.correctAnswers++;
    } else {
      this.wrongAnswers++;
    }
    
    this.updateProgress();
    this.showFeedback(isCorrect, timeTaken);
    
    this.submitBtn.style.display = 'none';
    this.nextBtn.style.display = 'inline-block';
    this.answerInput.disabled = true;
  }

  checkAnswer(userAnswer) {
    const tolerance = 0.01; // Allow small floating point differences
    return Math.abs(userAnswer - this.correctAnswer) < tolerance;
  }

  showFeedback(isCorrect, timeTaken) {
    this.feedback.className = 'feedback';
    
    if (isCorrect) {
      this.feedback.classList.add('correct');
      this.feedback.innerHTML = `✅ Correct! <br>Time: ${timeTaken.toFixed(1)} seconds`;
    } else {
      this.feedback.classList.add('wrong');
      this.feedback.innerHTML = `❌ Wrong! <br>Correct answer: ${this.correctAnswer}<br>Time: ${timeTaken.toFixed(1)} seconds`;
    }
  }

  resetAnswerSection() {
    this.answerInput.value = '';
    this.answerInput.disabled = false;
    this.answerInput.focus();
    this.submitBtn.style.display = 'inline-block';
    this.nextBtn.style.display = 'none';
    this.feedback.className = 'feedback';
    this.feedback.innerHTML = '';
  }

  showResults() {
    this.gameSection.style.display = 'none';
    this.resultsSection.style.display = 'block';
    
    const percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    const averageTime = this.allTimes.length > 0 ? 
      (this.allTimes.reduce((a, b) => a + b, 0) / this.allTimes.length).toFixed(1) : '0.0';
    
    this.finalScore.textContent = this.correctAnswers;
    this.finalTotal.textContent = this.totalQuestions;
    this.scorePercentage.textContent = `${percentage}%`;
    this.correctCount.textContent = this.correctAnswers;
    this.wrongCount.textContent = this.wrongAnswers;
    this.averageTime.textContent = `${averageTime}s`;
    
    // Performance message
    let message = '';
    if (percentage >= 90) {
      message = '🌟 Outstanding! You\'re a math wizard!';
    } else if (percentage >= 80) {
      message = '🎉 Excellent work! Keep it up!';
    } else if (percentage >= 70) {
      message = '👍 Good job! You\'re improving!';
    } else if (percentage >= 50) {
      message = '💪 Not bad! Practice makes perfect!';
    } else {
      message = '📚 Keep practicing! You\'ll get better!';
    }
    
    this.performanceMessage.textContent = message;
  }

  backToSettings() {
    this.stopTimer();
    this.countdownActive = false;
    this.countdownSection.style.display = 'none';
    this.questionDisplay.parentElement.style.display = 'block';
    this.settingsSection.style.display = 'block';
    this.gameSection.style.display = 'none';
    this.resultsSection.style.display = 'none';
    this.currentQuestion = null;
    this.timerDisplay.textContent = '0.0s';
    
    // Reset game state
    this.currentQuestionNumber = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.allTimes = [];
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new CalculationGame();
});
