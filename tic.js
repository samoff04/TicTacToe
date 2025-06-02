let isBot = false;
let currentPlayer = '😀';
let board = ["", "", "", "", "", "", "", "", ""];
let players = {};
let gameActive = false;

const dashboard = document.getElementById('dashboard');
const gameBoard = document.getElementById('game-board');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const boardDiv = document.getElementById('board');
const turnInfo = document.getElementById('turn-info');

const soundDashboard = document.getElementById('sound-dashboard');
const soundWin = document.getElementById('sound-win');
const soundLose = document.getElementById('sound-lose');
const soundDraw = document.getElementById('sound-draw');

window.onload = () => {
  dashboard.style.display = 'block';
  soundDashboard.play();
};

function showPopup(content) {
  popupContent.innerHTML = content;
  popup.style.display = 'flex';
}
function hidePopup() {
  popup.style.display = 'none';
}

function startPlayerGame() {
  showPopup(`
    <h2>Enter Player Names</h2>
    <input type="text" id="playerX" placeholder="Player 1 (😀)" />
    <input type="text" id="playerO" placeholder="Player 2 (😎)" />
    <br><button class="btn" onclick="beginGame(false)">Start</button>
  `);
}

function startBotGame() {
  showPopup(`
    <h2>Enter Your Name</h2>
    <input type="text" id="playerX" placeholder="Player (😀)" />
    <br><button class="btn" onclick="beginGame(true)">Start</button>
  `);
}

function beginGame(botMode) {
  isBot = botMode;
  players['😀'] = document.getElementById("playerX").value || "Player";
  players['😎'] = isBot ? "Bot" : (document.getElementById("playerO")?.value || "Player 2");
  hidePopup();
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = '😀';
  gameActive = true;
  updateBoard();
  dashboard.style.display = 'none';
  gameBoard.style.display = 'block';
  turnInfo.textContent = `${players[currentPlayer]}'s Turn (${currentPlayer})`;
}

function updateBoard() {
  boardDiv.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerText = val;
    cell.onclick = () => makeMove(i);
    boardDiv.appendChild(cell);
  });
}

function makeMove(index) {
  if (!gameActive || board[index]) return;
  board[index] = currentPlayer;
  updateBoard();
  if (checkWinner()) {
    gameOver(`${players[currentPlayer]} Wins!`, currentPlayer);
  } else if (!board.includes("")) {
    gameOver("It's a Draw!", 'draw');
  } else {
    currentPlayer = currentPlayer === '😀' ? '😎' : '😀';
    turnInfo.textContent = `${players[currentPlayer]}'s Turn (${currentPlayer})`;
    if (isBot && currentPlayer === '😎') {
      setTimeout(botMove, 500);
    }
  }
}

function botMove() {
  let move = getModerateBotMove();
  makeMove(move);
}

function getModerateBotMove() {
  if (Math.random() < 0.7) {
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "😎";
        if (checkWinner()) {
          board[i] = "";
          return i;
        }
        board[i] = "";
      }
    }
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "😀";
        if (checkWinner()) {
          board[i] = "";
          return i;
        }
        board[i] = "";
      }
    }
  }
  const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function gameOver(message, type) {
  gameActive = false;
  if (type === '😀') soundWin.play();
  else if (type === '😎') soundLose.play();
  else soundDraw.play();

  showPopup(`
    <h2>${message}</h2>
    <button class="btn" onclick="restartGame()">Restart</button>
  `);

  setTimeout(() => {
    if (popup.style.display === 'flex') {
      popup.style.display = 'none';
      gameBoard.style.display = 'none';
      dashboard.style.display = 'block';
      soundDashboard.play();
    }
  }, 3000);
}

function restartGame() {
  popup.style.display = 'none';
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = '😀';
  gameActive = true;
  updateBoard();
  dashboard.style.display = 'none';
  gameBoard.style.display = 'block';
  turnInfo.textContent = `${players[currentPlayer]}'s Turn (${currentPlayer})`;
  if (isBot && currentPlayer === '😎') {
    setTimeout(botMove, 500);
  }
}

function exitGame() {
  document.body.innerHTML = `
    <div class="container">
      <h1>👋 Goodbye!</h1>
      <p>We hope to see you again soon!</p>
    </div>`;
  setTimeout(() => {
    window.close();
  }, 2000);
}

function confirmLeave() {
  showPopup(`
    <h2>Leave Game?</h2>
    <p>Are you sure you want to go back to the dashboard?</p>
    <button class="btn" onclick="leaveGame()">Yes</button>
    <button class="btn" onclick="hidePopup()">No</button>
  `);
}

function leaveGame() {
  hidePopup();
  gameBoard.style.display = 'none';
  dashboard.style.display = 'block';
  soundDashboard.play();
}
