// Player object
const Player = (name, label) => {
  const playerLabel = label;
  const playerName = name;
  return { playerName, playerLabel };
};

// Gameboard object
const gameBoard = (() => {
  let grid;

  const gameBoardElem = document.getElementById("ttt-grid");

  // Reset board
  const initialize = () => {
    grid = ["", "", "", "", "", "", "", "", ""];
    renderHTML();
  };

  const getGrid = () => {
    return grid;
  };

  const updateGrid = (index, value) => {
    grid[index] = value;
  };

  const getGameBoardElem = () => {
    return gameBoardElem;
  };

  // Generate html for the whole grid element, with 9 children
  const renderHTML = () => {
    // Construct new html
    let finalHTML = ``;
    grid.forEach((gridValue, index) => {
      let squareValue;
      if (gridValue === "") {
        squareValue = `<div id="square${index}" class="square-value"></div>`;
      } else {
        squareValue = `<img id="square${index}" src="images/${gridValue}.png" class="square-value"/>`;
      }

      finalHTML =
        finalHTML +
        `
        <div class="square" onmousedown="game.boxClick(event)">
          ${squareValue}
        </div>
        `;
    });

    gameBoardElem.innerHTML = finalHTML;
  };

  // Function to disable controls of grid
  const disable = () => {
    let squares = document.querySelectorAll(".square");
    squares.forEach(element => element.style.pointerEvents = "none");
  }

  return {
    getGrid,
    updateGrid,
    initialize,
    renderHTML,
    getGameBoardElem,
    disable,
  };
})();

// Gameplay object
const game = (() => {
  let activePlayer;
  let prefPlayer;
  let player1;
  let player2;
  const messageBoardElem = document.getElementById("message-board");
  const messageElem = document.getElementById("message");

  // Play a game (main function)
  const play = () => {

    player1 = Player(document.getElementById("player1-name").innerText,"X");
    player2 = Player(document.getElementById("player2-name").innerText,"O");
    // Set up a game
    activePlayer = player1;
    gameBoard.initialize();
    gameBoard.renderHTML();
    messageElem.innerHTML = `Click a square to play`;
  };

  // Box click event handler
  const boxClick = (e) => {
    // Get index of box that was clicked
    const ind = e.target.firstElementChild.id.slice(-1);

    // If the space is empty, update and check for win
    if (gameBoard.getGrid()[ind] === "") {
      gameBoard.updateGrid(ind, activePlayer.playerLabel);
      gameBoard.renderHTML();

      const winner = checkWin(gameBoard.getGrid());
      if (winner !== "") {
        endGame(winner);
      } else if (Array.from(gameBoard.getGrid()).every((val) => val !== "")) {
        endGame();
      } else {
        setActivePlayer();
      }
    }
  };

  // Toggle active player
  const setActivePlayer = () => {
    
    // Set active player
    switch (activePlayer) {
      case undefined:
        activePlayer = prefPlayer;
        break;
      case player1:
        activePlayer = player2;
        messageBoardElem.classList.remove("left");
        messageBoardElem.classList.add("right");
        break;
      case player2:
        activePlayer = player1;
        messageBoardElem.classList.remove("right");
        messageBoardElem.classList.add("left");
        break;
    }

    // Update label
    messageElem.innerHTML = `${activePlayer.playerName}'s turn`;

  };

  // Check for victory
  const checkWin = (grid) => {
    const checkSub = (array, ind = []) => {
      // Create sub array of win condition
      let sub = [];
      for (let i = 0; i < ind.length; i++) {
        sub.push(array[ind[i]]);
      }

      return sub.every((val) => val === sub[0]) ? sub[0] : "";
    };

    // Can check every victory condition every time (8 conditions, not bad)
    let winner;
    if (!winner) winner = checkSub(grid, [0, 1, 2]);
    if (!winner) winner = checkSub(grid, [3, 4, 5]);
    if (!winner) winner = checkSub(grid, [6, 7, 8]);
    if (!winner) winner = checkSub(grid, [0, 3, 6]);
    if (!winner) winner = checkSub(grid, [1, 4, 7]);
    if (!winner) winner = checkSub(grid, [2, 5, 8]);
    if (!winner) winner = checkSub(grid, [0, 4, 8]);
    if (!winner) winner = checkSub(grid, [2, 4, 6]);

    return winner;
  };

  // End game function
  const endGame = (winner="") => {
    
    // Display victory message
    messageBoardElem.classList.remove("left");
    messageBoardElem.classList.remove("right");
    messageElem.innerHTML = `${(winner!=="") ? activePlayer.playerName : "Nobody"} has won!`;

    // Disable controls except setup controls
    gameBoard.disable();

  };

  return {
    play,
    boxClick,
  };
})();

game.play();
