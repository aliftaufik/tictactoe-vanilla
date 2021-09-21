/** Constants and utilities */
const playerColors = [
  {
    owned: "bg-[#f82529]",
    hover: "hover:bg-[#f94144]",
  },
  {
    owned: "bg-[#ed8607]",
    hover: "hover:bg-[#f8961e]",
  },
  {
    owned: "bg-[#f86c25]",
    hover: "hover:bg-[#f9844a]",
  },
  {
    owned: "bg-[#f7b926]",
    hover: "hover:bg-[#f9c74f]",
  },
  {
    owned: "bg-[#7eb356]",
    hover: "hover:bg-[#90be6d]",
  },
  {
    owned: "bg-[#3a9278]",
    hover: "hover:bg-[#43aa8b]",
  },
  {
    owned: "bg-[#407776]",
    hover: "hover:bg-[#4d908e]",
  },
  {
    owned: "bg-[#4d6880]",
    hover: "hover:bg-[#577590]",
  },
  {
    owned: "bg-[#206683]",
    hover: "hover:bg-[#277da1]",
  },
  {
    owned: "bg-[#dbd1d9]",
    hover: "hover:bg-[#eae4e9]",
  },
  {
    owned: "bg-[#ffdcc2]",
    hover: "hover:bg-[#fff1e6]",
  },
  {
    owned: "bg-[#fbc6c9]",
    hover: "hover:bg-[#fde2e4]",
  },
  {
    owned: "bg-[#f7b6cd]",
    hover: "hover:bg-[#fad2e1]",
  },
  {
    owned: "bg-[#cedfda]",
    hover: "hover:bg-[#e2ece9]",
  },
  {
    owned: "bg-[#a7d6dd]",
    hover: "hover:bg-[#bee1e6]",
  },
  {
    owned: "bg-[#e5e3dc]",
    hover: "hover:bg-[#f0efeb]",
  },
  {
    owned: "bg-[#c5d4fb]",
    hover: "hover:bg-[#dfe7fd]",
  },
  {
    owned: "bg-[#b1c5fc]",
    hover: "hover:bg-[#cddafd]",
  },
];

const colors = {
  red: {
    default: "bg-[#fb3640]",
    hover: "hover:bg-[#fa0f1b]",
    // default: "bg-[#fc5f67]",
    // hover: "hover:bg-[#fb3640]",
  },
  yellow: {
    default: "bg-[#ffee33]",
    hover: "hover:bg-[#ffdd00]",
    // default: "bg-[#ffdd00]",
    // hover: "hover:bg-[#ffee33]",
  },
  gray: {
    default: "bg-[#eaebeb]",
  },
  draw: {
    owned: "bg-[#eaebeb]",
  },
  o: playerColors[0],
  x: playerColors[1],
};

const randomPickPlayerColor = () => {
  const oIndex = Math.floor(Math.random() * playerColors.length);
  let xIndex;
  do {
    xIndex = Math.floor(Math.random() * playerColors.length);
  } while (oIndex === xIndex);

  colors.o = playerColors[oIndex];
  colors.x = playerColors[xIndex];
};

const elementClasses = {
  buttonDefaultTransitionClass:
    "hover:-mt-2 shadow-none hover:shadow-lg transition-all duration-[450ms]",
  boardButtonDefaultClass:
    "btn h-full w-full flex justify-center items-center transition-all duration-[450ms]",
  boardButtonWrapperDefaultClass:
    "w-16 h-16 flex-shrink-0 transition-all duration-[450ms]",
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

/** Constants and utilities */

/** Game State */
let state = {
  size: "3",
  turn: "o",
  board: [],
};
/** Game State */

/** Game Mechanism */
const handleBoardButtonClick = (position) => {
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

  const winner = checkWinner();
  const draw = state.board.every((item) => !!item);
  if (winner) buildWinnerAnnouncer(winner);
  else if (draw) buildWinnerAnnouncer({ winner: "draw" });
  updateBoard(state, winner);
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

const updateBoard = (state, winner) => {
  const buttonList = document.querySelectorAll(".btn");
  buttonList.forEach((buttonElement, index) => {
    if (winner) {
      buttonElement = buildBoardButtonGameOver(
        winner.range.includes(index),
        state.board[index],
        buttonElement
      );
    } else if (state.board[index]) {
      buttonElement = buildBoardButtonOwned(state.board[index], buttonElement);
    } else {
      buttonElement = buildBoardButtonTurn(state.turn, index, buttonElement);
    }
  });
};

// Restart handler, will mutate state and reset board and winner announcer
const handleRestartButtonClick = () => {
  const oldState = state;
  const newState = {
    ...oldState,
    turn: "o",
    board: oldState.board.map(() => ""),
  };
  state = newState;

  randomPickPlayerColor();
  buildWinnerAnnouncer();
  updateBoard(state);
};

// Move from Board to Home and init home
const handleBackToHome = async () => {
  // Hide board
  const boardElement = document.getElementById("board");
  boardElement.parentElement.classList.remove("opacity-1");
  boardElement.parentElement.classList.add("opacity-0");

  // Hide nav
  const navElement = document.getElementById("nav");
  navElement.classList.remove("opacity-1");
  navElement.classList.add("opacity-0");

  await awaitDuration();

  clearChildren(boardElement);
  clearChildren(navElement);
  initHome();
};
/** Game Mechanism */

/** Board Button Builder */
const buildBoardButtonOwned = (owner, buttonElement) => {
  if (!buttonElement) {
    buttonElement = document.createElement("button");
  } else {
    buttonElement.parentElement.className = [
      elementClasses.boardButtonWrapperDefaultClass,
      "p-2",
    ].join(" ");
  }

  clearChildren(buttonElement); // Remove owner text
  buttonElement.className = [
    elementClasses.boardButtonDefaultClass,
    "rounded-[50%] cursor-default",
  ].join(" ");

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

  return buttonElement;
};

const buildBoardButtonTurn = (turn, position, buttonElement) => {
  if (!buttonElement) {
    buttonElement = document.createElement("button");
  } else {
    buttonElement.parentElement.className = [
      elementClasses.boardButtonWrapperDefaultClass,
      "p-2 hover:p-1",
    ].join(" ");
  }

  clearChildren(buttonElement); // Remove owner text
  buttonElement.className = [
    elementClasses.boardButtonDefaultClass,
    "rounded-[4px]",
    colors.gray.default,
  ].join(" ");

  if (turn === "o") {
    buttonElement.classList.add(colors.o.hover);
  } else {
    buttonElement.classList.add(colors.x.hover);
  }

  buttonElement.onclick = () => handleBoardButtonClick(position);

  return buttonElement;
};

const buildBoardButtonGameOver = (inRange, owner, buttonElement) => {
  if (!buttonElement) {
    buttonElement = document.createElement("button");
  } else {
    buttonElement.parentElement.className = [
      elementClasses.boardButtonWrapperDefaultClass,
      "p-2",
    ].join(" ");
  }

  clearChildren(buttonElement); // Remove owner text

  if (owner) {
    buttonElement = buildBoardButtonOwned(owner, buttonElement);
    if (inRange) buttonElement.parentElement?.classList.replace("p-2", "p-1");
  } else {
    buttonElement.className = [
      elementClasses.boardButtonDefaultClass,
      "rounded-[4px] cursor-default",
      colors.gray.default,
    ].join(" ");
  }

  if (!inRange) {
    buttonElement.classList.add("opacity-25");
  }

  buttonElement.onclick = null;

  return buttonElement;
};
/** Board Button Builder */

/** Winner Announcer Builder */
const buildWinnerAnnouncer = async (winner) => {
  let winnerElement = document.getElementById("winner");
  if (!winnerElement) {
    winnerElement = document.createElement("div");

    winnerElement.id = "winner";

    const pElement = document.createElement("p");
    pElement.className = "text-center whitespace-nowrap";
    winnerElement.replaceChildren(pElement);
  }

  winnerElement.className =
    "overflow-hidden rounded-full transition-all duration-[450ms] py-2";

  if (winner) {
    winnerElement.classList.add(
      "w-[120px]",
      "px-6",
      "opacity-1",
      colors[winner.winner].owned
    );

    winnerElement.firstElementChild.textContent =
      winner.winner === "draw"
        ? "Draw!!!"
        : winner.winner.toUpperCase() + " Wins!!!";
  } else {
    winnerElement.classList.add("w-0", "px-0", "opacity-0");
    await awaitDuration();
    winnerElement.firstElementChild.textContent = "";
  }

  return winnerElement;
};
/** Winner Announcer Builder */

/** Board Initialization */
const initNav = async () => {
  const navElement = document.getElementById("nav");
  clearChildren(navElement);

  // Back Button
  const backButton = document.createElement("button");
  backButton.className = [
    elementClasses.buttonDefaultTransitionClass,
    `w-10 h-10 rounded-full ${colors.red.default} ${colors.red.hover} flex justify-center items-center`,
  ].join(" ");
  backButton.onclick = handleBackToHome;
  const backButtonP = document.createElement("p");
  backButtonP.className = "text-3xl mt-1.5";
  backButtonP.textContent = "<";
  backButton.appendChild(backButtonP);
  navElement.appendChild(backButton);

  // Winner Element (will be used to show winner later during the game)
  const winnerElement = await buildWinnerAnnouncer();
  navElement.appendChild(winnerElement);

  // Restart Button
  const buttonRestart = document.createElement("button");
  buttonRestart.className = [
    elementClasses.buttonDefaultTransitionClass,
    "py-2 px-3 rounded-full bg-[#ffa033] hover:bg-[#ff8800]",
  ].join(" ");
  buttonRestart.textContent = "Restart";
  buttonRestart.onclick = handleRestartButtonClick;
  navElement.appendChild(buttonRestart);

  // Unhide nav
  navElement.classList.remove("opacity-0");
  navElement.classList.add("opacity-1");
};

// Building board button with wrapper, only used during board initialization
const initBoardButton = (turn, position) => {
  const wrapperElement = document.createElement("div");
  wrapperElement.className = [
    elementClasses.boardButtonWrapperDefaultClass,
    "p-2 hover:p-1",
  ].join(" ");

  const buttonElement = buildBoardButtonTurn(turn, position);
  wrapperElement.appendChild(buttonElement);

  return wrapperElement;
};

const initBoard = () => {
  const boardElement = document.getElementById("board");
  clearChildren(boardElement);

  const sideLength = Math.sqrt(state.board.length);

  for (let row = 0; row < sideLength; row++) {
    const flexElement = document.createElement("div");
    flexElement.className =
      "w-min flex place-items-center content-center justify-start";

    for (let col = 0; col < sideLength; col++) {
      const currentPosition = row * sideLength + col;
      const boardButton = initBoardButton(state.turn, currentPosition);
      flexElement.appendChild(boardButton);
    }

    boardElement.appendChild(flexElement);
  }

  // Unhide board
  boardElement.parentElement.classList.remove("opacity-0");
  boardElement.parentElement.classList.add("opacity-1");

  initNav();
};
/** Board Initialization */

/** Home Initialization */
// const initButtonBoardSizeList = () => {
//   const parentWrapper = document.createElement("div");
//   parentWrapper.className = "w-screen overflow-x-scroll";
//   const wrapperElement = document.createElement("div");
//   wrapperElement.className =
//     "flex items-center space-x-2 w-min overflow-y-visible px-4 pb-4 pt-2 mx-auto";

//   parentWrapper.appendChild(wrapperElement);

//   for (let size = 3; size < 12; size += 2) {
//     const buttonSize = document.createElement("button");
//     buttonSize.className = [
//       elementClasses.buttonDefaultTransitionClass,
//       "btn-board-size rounded px-4 py-2 whitespace-nowrap",
//     ].join(" ");

//     if (size === state.size) {
//       buttonSize.classList.add(colors.yellow.default);
//     } else {
//       buttonSize.classList.add(colors.gray.default, colors.yellow.hover);
//     }

//     buttonSize.textContent = `${size} x ${size}`;
//     buttonSize.onclick = (e) => updateBoardSize(e, size);
//     wrapperElement.appendChild(buttonSize);
//   }

//   return parentWrapper;
// };

const initInputBoardSize = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-center items-center mt-4 group";

  const pBoardSize = document.createElement("p");
  pBoardSize.className = "mr-2";
  pBoardSize.textContent = "Board size: ";
  wrapper.appendChild(pBoardSize);

  const inputElement = document.createElement("input");
  inputElement.id = "input-size";
  inputElement.className =
    "rounded px-2 py-1 outline-none text-right transition-all group-hover:ring-2 focus:ring-2 group-hover:ring-[#fb3640] focus:ring-[#fb3640] group-hover:mr-2 focus:mr-2";
  inputElement.value = state.size;
  inputElement.size = state.size.length;
  inputElement.oninput = handleBoardSizeInput;
  inputElement.onblur = handleBoardSizeBlur;
  wrapper.appendChild(inputElement);

  const xLabelElement = document.createElement("label");
  xLabelElement.htmlFor = "input-size";
  xLabelElement.textContent = "x";
  wrapper.appendChild(xLabelElement);

  const labelElement = document.createElement("label");
  labelElement.id = "label-size";
  labelElement.htmlFor = "input-size";
  labelElement.className = "ml-2 transition-opacity duration-[450ms] opacity-1";
  labelElement.textContent = state.size;
  wrapper.appendChild(labelElement);

  return wrapper;
};

const initHome = () => {
  const homeElement = document.getElementById("home");
  clearChildren(homeElement);

  const buttonStart = document.createElement("button");
  buttonStart.className =
    "rounded px-8 py-4 mt-6 transition-all duration-[450ms] bg-[#669bbc] hover:bg-[#c1121f] hover:text-white";
  buttonStart.textContent = "Start Game";
  buttonStart.onclick = handleStartGame;
  homeElement.appendChild(buttonStart);

  const buttonBoardSizeList = initInputBoardSize();
  homeElement.appendChild(buttonBoardSizeList);

  // Unhide home
  homeElement.classList.remove("opacity-0");
  homeElement.classList.add("opacity-1");
};
/** Home Initialization */

/** Home Mechanism */
const handleBoardSizeBlur = (e) => {
  let value = Number(e.target.value);
  if (value < 3) value = 3;
  if (value % 2 === 0) value = value - 1;

  state.size = String(value);

  updateBoardSizeInput(state.size);
  updateBoardSizeLabel(state.size);
};

const handleBoardSizeInput = (e) => {
  let value = e.target.value.replace(/[^0-9]+/gi, "");
  if (value.length > 1 && value.startsWith("0")) value = value.substr(1);
  else if (!value) value = "0";
  if (Number(value) > 65535) value = String(65535);
  state.size = value;

  updateBoardSizeInput(state.size);
  updateBoardSizeLabel(state.size);
};

const updateBoardSizeInput = (size) => {
  const inputElement = document.getElementById("input-size");
  inputElement.value = size;

  inputElement.size = size.length;
};

let debouncerId = null;
const updateBoardSizeLabel = (size) => {
  const labelElement = document.getElementById("label-size");
  labelElement.classList.remove("opacity-1");
  labelElement.classList.add("opacity-0");

  clearTimeout(debouncerId);
  debouncerId = setTimeout(() => {
    labelElement.textContent = size;
    labelElement.classList.remove("opacity-0");
    labelElement.classList.add("opacity-1");
  }, 600);
};

// const updateBoardSize = (e, boardSize) => {
//   if (state.size === boardSize) return;
//   state.size = boardSize;
//   updateButtonBoardSizeList(e);
//   updateHomeWording(state.size);
// };

// const updateButtonBoardSizeList = (e) => {
//   const buttonBoardSizeList = document.querySelectorAll(".btn-board-size");
//   buttonBoardSizeList.forEach((buttonElement) => {
//     if (buttonElement === e.target) {
//       buttonElement.classList.remove(colors.yellow.hover);
//       buttonElement.classList.replace(
//         colors.gray.default,
//         colors.yellow.default
//       );
//     } else {
//       buttonElement.classList.replace(
//         colors.yellow.default,
//         colors.gray.default
//       );
//       buttonElement.classList.add(colors.yellow.hover);
//     }
//   });
// };

// const updateHomeWording = async (size) => {
//   const pBoardSize = document.getElementById("p-board-size");
//   pBoardSize.classList.replace("opacity-1", "opacity-0");
//   await awaitDuration();
//   pBoardSize.textContent = `${size} x ${size}${
//     size === 3 ? " (Standard)" : ""
//   }`;
//   pBoardSize.classList.replace("opacity-0", "opacity-1");
// };

// Move from Home to Board and init board
const handleStartGame = async () => {
  const size = Number(state.size);
  state.board = new Array(size * size).fill("");

  // Hide home
  const homeElement = document.getElementById("home");
  homeElement.classList.remove("opacity-1");
  homeElement.classList.add("opacity-0");

  randomPickPlayerColor();

  await awaitDuration();

  clearChildren(homeElement);
  initBoard();
};
/** Home Mechanism */

window.onload = () => {
  initHome();
};
