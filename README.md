# 🧮 Mental Calculation Practice

A modern, interactive web application for practicing mental math skills with customizable difficulty levels and real-time performance tracking.

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## ✨ Features

### Core Functionality

- **Customizable Practice Sessions**
  - Configurable number ranges for both operands (1-100)
  - Multiple operation types: Addition, Subtraction, Multiplication, Division
  - Mixed operation mode for varied practice
  - Adjustable question count (1-50 questions per session)

- **Interactive Learning Experience**
  - Real-time timer for each question
  - Countdown before each question with motivational quotes
  - Immediate feedback on answers
  - Detailed performance analytics

- **Progress Tracking**
  - Visual progress bar showing completion status
  - Live score counter during practice
  - Comprehensive results summary with:
    - Final score and percentage
    - Correct/incorrect answer breakdown
    - Average time per question
    - Performance-based motivational messages

- **Question History**
  - Complete review of all questions attempted
  - Side-by-side comparison of user answers vs. correct answers
  - Time taken for each question
  - Visual indicators for correct/incorrect responses

### Additional Features

- **Visitor Analytics**
  - Total visit counter
  - Session-based tracking

- **Community Feedback**
  - Anonymous comment system
  - Real-time comment updates
  - Basic content filtering
  - Timestamp for all comments

## 🚀 Demo

Visit the live application: [Your Deployment URL]

## 📦 Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/calculation.git
   cd calculation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Starting a Practice Session

1. **Configure Settings**
   - Set the range for the first number (e.g., 10-50)
   - Set the range for the second number (e.g., 1-10)
   - Select one or more operations (Addition, Subtraction, Multiplication, Division)
   - Choose the number of questions (1-50)

2. **Begin Practice**
   - Click "Start Practice"
   - A 3-second countdown will begin
   - Motivational quote appears before each question

3. **Answer Questions**
   - Type your answer in the input field
   - Press Enter or click "Submit"
   - Immediate feedback shows if you're correct
   - Timer records your response time

4. **Review Results**
   - View overall performance statistics
   - Review each question with correct answers
   - Compare your answers and time taken
   - Click "Practice Again" to start a new session

### Leaving Feedback

1. Click "💬 Comments & Feedback" in the header
2. Enter your nickname (optional) or remain anonymous
3. Write your comment (max 500 characters)
4. Click "Post Comment"
5. View all community feedback in real-time

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3000
NODE_ENV=production
```

### Customization Options

#### Number Ranges
- Minimum: 1
- Maximum: 100
- Independent configuration for first and second numbers

#### Operations
- Addition (+): Standard arithmetic addition
- Subtraction (−): Standard arithmetic subtraction
- Multiplication (×): Standard arithmetic multiplication
- Division (÷): Decimal division (rounded to 2 decimal places)

#### Question Count
- Minimum: 1 question
- Maximum: 50 questions per session

## 📡 API Documentation

### Visitor Tracking

#### Get Visitor Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "totalVisits": 1234,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

### Comments System

#### Get All Comments
```http
GET /api/comments
```

**Response:**
```json
{
  "comments": [
    {
      "id": "abc123",
      "nickname": "User123",
      "message": "Great app!",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 42,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

#### Post a Comment
```http
POST /api/comments
Content-Type: application/json

{
  "nickname": "User123",
  "message": "Great app for mental math practice!"
}
```

**Response:**
```json
{
  "success": true,
  "comment": {
    "id": "abc123",
    "nickname": "User123",
    "message": "Great app for mental math practice!",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Message is required"
}
```

## 📁 Project Structure

```
calculation/
├── css/
│   ├── style.css           # Main application styles
│   └── comments.css        # Comments page styles
├── js/
│   ├── app.js              # Core game logic
│   ├── visitor-tracking.js # Analytics tracking
│   └── comments.js         # Comments functionality
├── index.html              # Main application page
├── comments.html           # Comments and feedback page
├── server.js               # Express server
├── package.json            # Project dependencies
├── visitor-stats.json      # Visitor analytics data (auto-generated)
├── comments.json           # User comments data (auto-generated)
└── README.md               # Project documentation
```

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
  - Flexbox & Grid layouts
  - CSS animations and transitions
  - Responsive design
- **Vanilla JavaScript** - ES6+ features
  - Classes and modules
  - Async/await
  - DOM manipulation
  - LocalStorage API

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **File System (fs)** - Data persistence

### Development Tools
- **Webpack** - Module bundler
- **npm** - Package management

## 🎨 Features Breakdown

### CalculationGame Class

The main game logic is handled by the `CalculationGame` class:

#### Key Methods:

- **`startGame()`** - Initializes a new practice session
- **`validateInputs()`** - Ensures all settings are valid
- **`createQuestion()`** - Generates random questions based on selected operations
- **`submitAnswer()`** - Processes user responses and provides feedback
- **`showResults()`** - Displays comprehensive performance summary
- **`displayQuestionHistory()`** - Shows detailed review of all questions

### Visitor Tracking

- Session-based visitor counting
- Persistent storage using JSON files
- No external database required
- Privacy-focused (minimal data collection)

### Comments System

- Anonymous commenting support
- Optional nickname field
- Character limit (500 characters)
- Basic content filtering for inappropriate content
- Real-time updates every 30 seconds
- Timestamp for all comments
- IP address logging for moderation

## 🔒 Security Features

- **Input Validation** - All user inputs are validated
- **Content Filtering** - Basic profanity filter for comments
- **HTML Sanitization** - Prevents XSS attacks
- **Rate Limiting** - Character limits on comments
- **Session Tracking** - Prevents duplicate visit counting

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1920px+)
- Laptops (1024px+)
- Tablets (768px+)
- Mobile devices (320px+)

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Deploy!

### Deploy to Heroku

```bash
heroku create your-app-name
git push heroku main
heroku open
```

### Deploy to Vercel

```bash
vercel
```


## 🐛 Known Issues

- Division questions may produce decimal answers (rounded to 2 places)
- JSON file storage has limitations for high-traffic scenarios
- Comments are stored locally (not suitable for distributed systems)

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Leaderboard system
- [ ] Timed challenges
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Sound effects and animations
- [ ] Mobile app version
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Social sharing features
- [ ] Detailed analytics dashboard
- [ ] Keyboard shortcuts
- [ ] Dark mode theme
- [ ] Multiple language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Roti John (aka Badar)**

- GitHub: [@yourusername](https://github.com/badar24434)

## 🙏 Acknowledgments

- Inspired by mental math practice needs
- Built with modern web technologies
- Community feedback and suggestions
- HTML5 Boilerplate for base template


---

Made with ❤️ by Roti John | © 2024 Mental Calculation Practice
