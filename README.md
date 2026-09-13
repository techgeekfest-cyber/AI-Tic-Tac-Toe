# 🎮 Tic-Tac-Toe AI

An interactive Tic-Tac-Toe web application featuring an **AI opponent**, responsive gameplay, and automatic game-state evaluation.

The project combines game development with basic **Artificial Intelligence and algorithmic decision-making**, allowing a player to compete against an AI opponent directly in the browser.

## ✨ Features

* 🤖 Human vs AI gameplay
* 🎮 Interactive Tic-Tac-Toe board
* 🧠 AI-based move selection
* ✅ Automatic win and draw detection
* 🔄 New game / reset functionality
* 📊 Game and score tracking
* 📱 Responsive design for desktop and mobile
* ⚡ Fast client-side gameplay

## 🧠 AI Approach

The AI analyzes the current board state and selects a move based on the available game states and possible outcomes.

The project demonstrates fundamental concepts used in AI game playing, including:

* Game-state representation
* Decision-making
* Search over possible moves
* Win/loss evaluation
* Optimal move selection

> **Note:** The exact AI strategy and implementation should be checked against the source code. The project description intentionally avoids claiming a specific algorithm such as Minimax unless it is actually implemented.

## 🛠️ Technologies

* JavaScript / TypeScript
* React
* HTML
* CSS
* Browser-based game logic
* AI-based game decision making

## 🏗️ How It Works

The application maintains the current state of the Tic-Tac-Toe board.

When the human player makes a move:

```text
Player Move
     ↓
Update Board State
     ↓
Check Win / Draw
     ↓
AI Evaluates Available Moves
     ↓
AI Selects a Move
     ↓
Update Board
     ↓
Check Game Result
```

The process continues until either the player or AI wins, or the game reaches a draw.

## 🎯 Purpose & Learning Objectives

This project was developed as a practical application of the concepts I learned during my **Artificial Intelligence** coursework.

The goal was to understand how classical AI techniques can be applied to game-playing and decision-making problems by implementing them in an interactive application.

Key concepts explored include:

* **Minimax algorithm** for adversarial game-state evaluation
* **Alpha-Beta pruning** for optimizing game-tree search
* **A* search algorithm** and heuristic search concepts
* **State-space search**
* **Game-tree representation**
* **Heuristic evaluation**
* **Recursive search and decision-making**

Rather than learning these algorithms only theoretically, this project was created to apply and experiment with them in a practical game-development context.

## 📄 License

This project is developed for educational and portfolio purposes.
