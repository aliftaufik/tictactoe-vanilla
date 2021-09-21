# tictactoe-vanilla

Tictactoe game using vanilla javascript

### Development Summary

Technology used:

- html
- javascript
- css with tailwindcss with JIT as builder

Features:

- Multiple board sizes including 3x3 (standard), 5x5, 7x7, 9x9, and 11x11
- Random player colors that changes in each game
- Can restart game anytime (player color will also change!)
- Mobile friendly

Other features/improvements that can be implemented:

- Add background music and click sound in game that can be activated/deactivated from settings
- Use slider for board size, or let user input board size they desire
- Curate more colors for player, or if possible, use API (if any) or programmatically get random colors for player
- Add confirmation dialog for when the user wants to go back to home or restart the game when the game already started

This project has been implemented using html, vanilla javascript and css, without any build script necessary. The only tooling used is tailwindcss, which is a utility-first css framework. I used tailwindcss during development time using it's CLI to watch for it's style classes usage and update the style.css dynamically. And during deployment, I used tailwindcss CLI to build the style.css, removing any unused style classes. It's CLI also has minify options, but as it makes harder for us to read the css file, I didn't use it.

### Gameplay

There are two pages (sort of) in this website, Home and Board. In Home page, we can customize board size that we want to use in game. And then, we can click Start Game button and play the tictactoe game in the Board page. Anytime if there's a winner, or if the board is filled without any player can win, the game ends and the result will be shown below the game board. There are also a restart button for when we to restart the game at any time, and a back button for us if we want to go back to Home page to change the board size.

### Implementation Detail

The game logic is inspired from React JS tutorial from React JS official website. I used a state object to keep track of board size (Number), player turn ("o" or "x"), board fields (Array of Strings). Board size is used to initialize the board fields when the player starts the game, and can be changed by player from Home Page. The player turn will keep track of which player is in turn to determine who's clicking the board field button and update board fields value. And the board fields is used to keep track of the field any player already owned and to check if there's a winner or when the game has reached to a draw.

There's also a colors object, which is used to give color to various buttons, and to hold players color during game. Players color will change anytime starting phase kicks in (when player click Start Game button or Restart button), where players will be assigned random color retreived from playerColors array.

When a player is in Home page and clicks to any board size button, it will change the board size value in state. When player clicks Start Game button, it will turn into starting phase. In this starting phase (and also during restarting phase), the game will initialize state's board fields with Array of empty Strings according to state's board size. It will also trigger randomPickPlayerColor function that will change players color used in game. After that, the board starts to render.

Anytime player clicks to board field button, it will update the state's board field and switch the state's player turn. After that, the game will check if there's any winner, or if all the board fields are already filled and the game reach to a draw. And then, it will rerender the board to match the updated board fields and and player turn. This means, updating the board field button styling and behavior to make in not clickable if it's already owned, and change the hovering color to match the current player turn. If the game reach to an end, it will rerender the board last time to make it static, removing all clicking listener, and update it's styling to show the winner range. It will then render the winner announcer, showing the winning player, or a draw result.

The winner checker function is programmed dynamically, so it can handle any board sizes without changing it's code. This means adding more board size options or letting player to specify the board size will be just updating the Home page for showing the size options, without needing to change the game mechanism.

After the game ends (or at anytime during the game), player has options to go back to Home page or restart the game. If player chooses to restart the game, it will trigger the restarting phase. During this phase, the state's player turn and board fields will be reset. And then, the game will rerender the board again, removing any owned board field. It will also hide the winner announcer, and player can start the game again (with different player colors as stated in starting phase before).

The back button will clear the rendered board and move player back to Home page, where player can start the game again using different board size.
