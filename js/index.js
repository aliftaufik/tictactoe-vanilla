/** Constants and utilities */
const colors = {
  gray: "bg-gray-200",
  o: {
    hover: "hover:bg-[#ffd685]",
    owned: "bg-[#ffc857]",
  },
  x: {
    hover: "hover:bg-[#33aed7]",
    owned: "bg-[#2596bb]",
  },
};

const animateButtonClass = () => {
  return `hover:-mt-2 transition-all duration-[450ms]`;
};

const awaitDuration = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 450)
  );
};

const clearChildren = (el) => {
  while (el.firstChild) el.removeChild(el.lastChild);
};
/** Constants */

/** State */
let state = {
  size: 3,
  turn: "o",
  board: [],
};
/** State */

/** State Change Handler */
const handleButtonClick = (position) => {
  const oldState = state;
  const newState = {
    ...oldState,
    turn: oldState.turn === "o" ? "x" : "o",
    board: oldState.board.map((item, index) => {
      if (index === position) return oldState.turn;
      return item;
    }),
  };
  state = newState;

  updateBoard(oldState, newState);

  // Check winner every time button triggered
  const winner = checkWinner();
  if (winner) gameOver(winner);
};

const checkWinner = () => {
  const board = [...state.board];
  const indexList = board.map((_, index) => index);

  const sideLength = Math.sqrt(board.length);

  const diagonalDown = [];
  const diagonalDownIndex = [];

  const diagonalUp = [];
  const diagonalUpIndex = [];

  // Custom function used to setup vertical range
  const buildVertical = (list, outerIndex) => {
    const vertical = [];
    for (let index = 0; index < sideLength; index++) {
      vertical.push(list[index * sideLength + outerIndex]);
    }
    return vertical;
  };

  const validateRange = (items) => {
    if (!items[0]) return false; // If first item is empty string, don't bother checking next value
    return items.every((item) => item === items[0]);
  };

  for (let index = 0; index < sideLength; index++) {
    // Check horizontal range once per loop (by index)
    // Sample:
    // 0,1,2
    // 3,4,5
    // 6,7,8
    const horizontal = board.slice(
      index * sideLength,
      index * sideLength + sideLength
    );
    const horizontalIndex = indexList.slice(
      index * sideLength,
      index * sideLength + sideLength
    );
    if (validateRange(horizontal))
      return { winner: horizontal[0], range: horizontalIndex };

    // Check vertical range once per loop (by index)
    // Sample:
    // 0,3,6
    // 1,4,7
    // 2,5,8
    const vertical = buildVertical(board, index);
    const verticalIndex = buildVertical(indexList, index);
    if (validateRange(vertical))
      return { winner: vertical[0], range: verticalIndex };

    // Using this loop to push diagonal range (will be validated later outside loop)
    diagonalDown.push(board[index * sideLength + index]);
    diagonalDownIndex.push(indexList[index * sideLength + index]);

    diagonalUp.push(board[(sideLength - index - 1) * sideLength + index]);
    diagonalUpIndex.push(
      indexList[(sideLength - index - 1) * sideLength + index]
    );
  }

  // Validating diagonal range
  // Sample:
  // 0,4,8
  // 6,4,2
  if (validateRange(diagonalDown))
    return { winner: diagonalDown[0], range: diagonalDownIndex };
  if (validateRange(diagonalUp))
    return { winner: diagonalUp[0], range: diagonalUpIndex };
  return null;
};

const handleRestart = () => {
  const oldState = state;
  const newState = {
    ...oldState,
    turn: "o",
    board: oldState.board.map(() => ""),
  };

  state = newState;
  updateBoard(oldState, newState);
};
/** State Change Handler */

/** UI Updater */
const updateBoard = (oldState, newState) => {
  const buttonList = document.querySelectorAll(".btn");

  buttonList.forEach((buttonElement, index) => {
    if (
      oldState.board[index] !== newState.board[index] &&
      !!newState.board[index]
    ) {
      updateButtonOwned(buttonElement, newState.board[index]);
    } else {
      updateButtonTurn(
        index,
        buttonElement,
        newState.turn,
        !!newState.board[index]
      );
    }
  });
};

const updateButtonOwned = (buttonElement, owner) => {
  buttonElement.classList.replace("rounded-[4px]", "rounded-[50%]");
  buttonElement.classList.remove(colors.gray, colors.o.hover, colors.x.hover);
  buttonElement.classList.add("cursor-default");

  buttonElement.parentElement.classList.remove("hover:p-1");

  const pElement = document.createElement("p");
  pElement.className = "text-3xl mt-1";

  if (owner === "o") {
    pElement.textContent = "O";
    buttonElement.classList.add(colors.o.owned);
  } else {
    pElement.textContent = "X";
    buttonElement.classList.add(colors.x.owned);
  }

  buttonElement.appendChild(pElement);
  buttonElement.onclick = null;
};

const updateButtonTurn = (position, buttonElement, turn, owned) => {
  if (!owned) {
    buttonElement.classList.replace("rounded-[50%]", "rounded-[4px]");
    buttonElement.classList.remove(
      "cursor-default",
      colors.o.owned,
      colors.x.owned
    );
    buttonElement.classList.add(colors.gray);
    buttonElement.textContent = "";
    buttonElement.onclick = () => handleButtonClick(position);
  }
  if (turn === "o") {
    buttonElement.classList.replace(colors.x.hover, colors.o.hover);
  } else {
    buttonElement.classList.replace(colors.o.hover, colors.x.hover);
  }
};

const gameOver = (winner) => {
  const winnerElement = document.getElementById("winner");
  winnerElement.classList.add("py-2", "px-6", colors[winner.winner].owned);

  const pElement = document.createElement("p");
  pElement.className = "text-center whitespace-nowrap";
  pElement.textContent = winner.winner.toUpperCase() + " Wins!!!";

  winnerElement.replaceChildren(pElement);
  winnerElement.classList.replace("opacity-0", "opacity-1");
  winnerElement.classList.replace("max-w-0", "max-w-min");

  const buttonList = document.querySelectorAll(".btn");
  buttonList.forEach((buttonElement, index) => {
    updateButtonGameOver(buttonElement, winner.range.includes(index));
  });
};

const updateButtonGameOver = (buttonElement, inRange) => {
  if (inRange) {
    buttonElement.parentElement.classList.replace("p-2", "p-1");
    return;
  }

  buttonElement.classList.remove(colors.o.hover, colors.x.hover);
  buttonElement.classList.add("opacity-25", "cursor-default");

  buttonElement.parentElement.classList.remove("hover:p-1");

  buttonElement.onclick = null;
};
/** UI Updater */

/** Board Initialization */
const buildButton = (turn, position) => {
  const wrapperElement = document.createElement("div");
  wrapperElement.className =
    "w-16 h-16 p-2 hover:p-1 transition-all duration-[450ms]";

  const buttonElement = document.createElement("button");
  buttonElement.className =
    "btn h-full w-full rounded-[4px] flex justify-center items-center transition-all duration-[450ms]";
  buttonElement.classList.add(colors.gray);

  if (turn === "o") {
    buttonElement.classList.add(colors.o.hover);
  }

  if (turn === "x") {
    buttonElement.classList.add(colors.x.hover);
  }

  buttonElement.onclick = () => handleButtonClick(position);

  wrapperElement.appendChild(buttonElement);
  return wrapperElement;
};

const initBoard = () => {
  initNav();

  const boardElement = document.getElementById("board");
  clearChildren(boardElement);

  const sideLength = Math.sqrt(state.board.length);

  for (let row = 0; row < sideLength; row++) {
    const flexElement = document.createElement("div");
    flexElement.className = "flex place-items-center place-content-center";

    for (let col = 0; col < sideLength; col++) {
      const currentPosition = row * sideLength + col;
      const buttonElement = buildButton(state.turn, currentPosition);
      flexElement.appendChild(buttonElement);
    }

    boardElement.appendChild(flexElement);
  }

  boardElement.classList.remove("opacity-0");
  boardElement.classList.add("opacity-1");
};

const initNav = () => {
  const navElement = document.getElementById("nav");
  clearChildren(navElement);

  // Back Button
  const backButton = document.createElement("button");
  backButton.className =
    "w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 hover:-mt-2 transition-all duration-[450ms] flex justify-center items-center";
  backButton.onclick = handleBackToHome;
  const backButtonP = document.createElement("p");
  backButtonP.className = "text-3xl mt-1.5";
  backButtonP.textContent = "<";
  backButton.appendChild(backButtonP);
  navElement.appendChild(backButton);

  // Winner Element (will be used to show winner later in the game)
  const winnerElement = document.createElement("div");
  winnerElement.id = "winner";
  winnerElement.className =
    "max-w-0 overflow-hidden rounded-full transition-all duration-[450ms] opacity-0";
  navElement.appendChild(winnerElement);

  // Restart Button
  const buttonRestart = document.createElement("button");
  buttonRestart.className =
    "py-2 px-3 rounded-full bg-gray-200 hover:bg-gray-300 hover:-mt-2 transition-all duration-[450ms]";
  buttonRestart.textContent = "Restart";
  buttonRestart.onclick = handleRestart;
  navElement.appendChild(buttonRestart);

  navElement.classList.remove("opacity-0");
  navElement.classList.add("opacity-1");
};

// Move from Board to Home and init game
const handleBackToHome = async () => {
  const boardElement = document.getElementById("board");
  boardElement.classList.remove("opacity-1");
  boardElement.classList.add("opacity-0");

  const navElement = document.getElementById("nav");
  navElement.classList.remove("opacity-1");
  navElement.classList.add("opacity-0");

  await awaitDuration();

  clearChildren(boardElement);
  clearChildren(navElement);
  initGame();
};
/** Board Initialization */

/** Game Initialization */
const updateBoardSize = (e, boardSize) => {
  if (state.size === boardSize) return;
  state.size = boardSize;
  updateButtonBoardSizeList(e);
  updateHomeWording();
};

const updateButtonBoardSizeList = (e) => {
  const buttonBoardSizeList = document.querySelectorAll(".btn-board-size");
  buttonBoardSizeList.forEach((buttonElement) => {
    if (buttonElement === e.target) {
      buttonElement.classList.remove("hover:bg-[#ffdc85]");
      buttonElement.classList.replace("bg-gray-200", "bg-[#ffcf56]");
    } else {
      buttonElement.classList.replace("bg-[#ffcf56]", "bg-gray-200");
      buttonElement.classList.add("hover:bg-[#ffdc85]");
    }
  });
};

const updateHomeWording = async () => {
  const pBoardSize = document.getElementById("p-board-size");
  pBoardSize.classList.replace("opacity-1", "opacity-0");
  await awaitDuration();
  pBoardSize.textContent = `${state.size} x ${state.size}${
    state.size === 3 ? " (Standard)" : ""
  }`;
  pBoardSize.classList.replace("opacity-0", "opacity-1");
};

const initButtonBoardSizeList = () => {
  const wrapperElement = document.createElement("div");
  wrapperElement.className =
    "flex items-center space-x-2 w-full max-w-[360px] overflow-x-scroll overflow-y-visible pb-4 pt-2 mx-auto";

  for (let size = 3; size < 12; size += 2) {
    const buttonSize = document.createElement("button");
    buttonSize.className = animateButtonClass();
    buttonSize.classList.add(
      "btn-board-size",
      "rounded",
      "px-4",
      "py-2",
      "whitespace-nowrap"
    );
    if (size === state.size) {
      buttonSize.classList.add("bg-[#ffcf56]");
    } else {
      buttonSize.classList.add("bg-gray-200", "hover:bg-[#ffdc85]");
    }
    buttonSize.textContent = `${size} x ${size}`;
    buttonSize.onclick = (e) => updateBoardSize(e, size);
    wrapperElement.appendChild(buttonSize);
  }

  return wrapperElement;
};

const initGame = () => {
  const homeElement = document.getElementById("home");
  clearChildren(homeElement);

  const buttonStart = document.createElement("button");
  buttonStart.className =
    "rounded px-8 py-4 mt-6 bg-gray-200 transition-all duration-[450ms] bg-[#7aa6cd] hover:bg-[#274a68] hover:text-white";
  buttonStart.textContent = "Start Game";
  buttonStart.onclick = handleStartGame;
  homeElement.appendChild(buttonStart);

  const pBoardSize = document.createElement("p");
  pBoardSize.id = "p-board-size";
  pBoardSize.className = "mt-2 transition-all duration[450ms] opacity-1";
  pBoardSize.textContent = `${state.size} x ${state.size}${
    state.size === 3 ? " (Standard)" : ""
  }`;
  homeElement.appendChild(pBoardSize);

  const pOtherBoard = document.createElement("p");
  pOtherBoard.className = "mt-8";
  pOtherBoard.textContent = "Or other board size:";
  homeElement.appendChild(pOtherBoard);

  const buttonBoardSizeList = initButtonBoardSizeList();
  homeElement.appendChild(buttonBoardSizeList);

  homeElement.classList.remove("opacity-0");
  homeElement.classList.add("opacity-1");
};

// Move from Home to Board and init board
const handleStartGame = async () => {
  state.board = new Array(state.size * state.size).fill("");

  const homeElement = document.getElementById("home");
  homeElement.classList.remove("opacity-1");
  homeElement.classList.add("opacity-0");

  await awaitDuration();

  clearChildren(homeElement);
  initBoard();
};
/** Game Initialization */

window.onload = () => {
  initGame();
};
