const buildButton = (owner, turn) => {
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

  return buttonElement
}

window.onload = () => {
  const buttonWrapperList = document.querySelectorAll('.btn-wrapper')

  buttonWrapperList.forEach(wrapper => {
    const buttonElement = buildButton('', 'x')
    wrapper.replaceChildren(buttonElement)
  })
}
