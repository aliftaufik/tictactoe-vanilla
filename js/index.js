const state = {
  turn: 'x',
  board: ['','','','','','','','','']
}

const buildButton = (owner, turn) => {
  const wrapperElement = document.createElement('div')
  wrapperElement.classList.add('w-16', 'h-16', 'p-2', 'btn-wrapper')

  const buttonElement = document.createElement('button')
  buttonElement.classList.add('h-full', 'w-full', 'rounded', 'bg-gray-100', 'transition-all')

  if (owner) { // Button has been owned by player
    if (owner === 'o') {
      buttonElement.classList.add('rounded-full', 'bg-red-400', 'cursor-default')
    }
  
    if (owner === 'x') {
      buttonElement.classList.add('rounded-full', 'bg-green-400', 'cursor-default')
    }
  } else { // Button hasn't been owned
    if (turn === 'o') {
      buttonElement.classList.add('hover:bg-red-200')
    }
  
    if (turn === 'x') {
      buttonElement.classList.add('hover:bg-green-200')
    }
  }

  wrapperElement.appendChild(buttonElement)
  return wrapperElement
}

const clearBoard = () => {
  const boardElement = document.getElementById('board')
  while(boardElement.firstChild) boardElement.removeChild(boardElement.lastChild)
}

const buildBoard = (state) => {
  clearBoard()

  const boardElement = document.getElementById('board')
  const sideLength = Math.sqrt(state.board.length)
  
  for (let row = 0; row < sideLength; row++) {
    const flexElement = document.createElement('div')
    flexElement.classList.add('flex', 'place-items-center', 'place-content-center')
    
    for (let col = 0; col < sideLength; col++) {
      const currentPosition = row * sideLength + col
      const buttonElement = buildButton(state.board[currentPosition], state.turn)
      flexElement.appendChild(buttonElement)
    }

    boardElement.appendChild(flexElement)
  }
}

window.onload = () => {
  buildBoard(state)
}
