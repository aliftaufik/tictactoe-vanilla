/** Constants */
const colors ={
  gray: 'bg-gray-100',
  o: {
    hover: 'hover:bg-[#ffd685]',
    owned: 'bg-[#ffc857]'
  },
  x: {
    hover: 'hover:bg-[#33aed7]',
    owned: 'bg-[#2596bb]'
  }
}

let state = {
  turn: 'o',
  board: ['','','','','','','','','']
}

/** State Change Handler */
const handleButtonClick = (position) => {
  const oldState = state
  const newState = {
    turn: oldState.turn === 'o' ? 'x' : 'o',
    board: oldState.board.map((item, index) => {
      if (index === position) return oldState.turn
      return item
    })
  }
  state = newState

  updateBoard(oldState, newState)
}

const updateBoard = (oldState, newState) => {
  const buttonList = document.querySelectorAll('.btn')

  buttonList.forEach((buttonElement, index) => {
    if (oldState.board[index] !== newState.board[index]) {
      updateButtonOwned(buttonElement, newState.board[index])
    } else {
      updateButtonTurn(buttonElement, newState.turn)
    }
  })
}

const updateButtonOwned = (buttonElement, owner) => {
  buttonElement.classList.replace('rounded-[4px]', 'rounded-[50%]')
  buttonElement.classList.remove(colors.gray, colors.o.hover, colors.x.hover)
  buttonElement.classList.add('cursor-default')

  buttonElement.parentElement.classList.remove('hover:p-1')

  const pElement = document.createElement('p')
  pElement.className = 'text-3xl'

  if (owner === 'o') {
    pElement.textContent = 'O'
    buttonElement.classList.add(colors.o.owned)
  } else {
    pElement.textContent = 'X'
    buttonElement.classList.add(colors.x.owned)
  }
  
  buttonElement.appendChild(pElement)
  buttonElement.onclick = null
}

const updateButtonTurn = (buttonElement, turn) => {
  if (turn === 'o') {
    buttonElement.classList.replace(colors.x.hover, colors.o.hover)
  } else {
    buttonElement.classList.replace(colors.o.hover, colors.x.hover)
  }
}
/** State Change Handler */


/** Board Initialization */
const buildButton = (turn, position) => {
  const wrapperElement = document.createElement('div')
  wrapperElement.className = 'w-16 h-16 p-2 hover:p-1 transition-all duration-[450ms]'

  const buttonElement = document.createElement('button')
  buttonElement.className = 'btn h-full w-full rounded-[4px] flex justify-center items-center transition-all duration-[450ms]'
  buttonElement.classList.add(colors.gray)

  if (turn === 'o') {
    buttonElement.classList.add(colors.o.hover)
  }

  if (turn === 'x') {
    buttonElement.classList.add(colors.x.hover)
  }

  buttonElement.onclick = () => handleButtonClick(position)

  wrapperElement.appendChild(buttonElement)
  return wrapperElement
}

const clearBoard = () => {
  const boardElement = document.getElementById('board')
  while(boardElement.firstChild) boardElement.removeChild(boardElement.lastChild)
}

const initBoard = () => {
  clearBoard()

  const boardElement = document.getElementById('board')
  const sideLength = Math.sqrt(state.board.length)
  
  for (let row = 0; row < sideLength; row++) {
    const flexElement = document.createElement('div')
    flexElement.className = 'flex place-items-center place-content-center'
    
    for (let col = 0; col < sideLength; col++) {
      const currentPosition = row * sideLength + col
      const buttonElement = buildButton(state.turn, currentPosition)
      flexElement.appendChild(buttonElement)
    }

    boardElement.appendChild(flexElement)
  }
}
/** Board Initialization */

window.onload = () => {
  initBoard()
}
