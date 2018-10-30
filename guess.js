const _ = require('lodash');
const input = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/**
 * Class GuessNumberGame
 *
 * Constructor takes a max number (e.g. 1-100 or 1-1000, etc) so game difficuty
 * can be adjusted. Also allows picking of number of tries
 *
 */
class GuessNumberGame {
  /**
   * @param int max maximum range for guessed number
   * @param int numTries the number of tries before the game ends
   *
   */
  constructor(max, numTries) {
    this.config = {
      max: max,
      numTries: numTries
    };
    this.reset();
  }

  reset() {
    this.target = _.random(1, this.config.max);
    this.numTries =this.config.numTries;
    this.history = [];
    this.active = true;
    console.log(`Try to guess the number (1 to ${ this.config.max }). You have ${ this.numTries } guesses.`);
  }

  /**
   * @param int num the player's guess.
   *
   */
  guess(num) {
    // Do not penalize the player for incorrect input
    if(!num.match(/^[0-9]+$/gi)) {
      console.log(`${ num } is not a valid number. Please try again. You still have ${ this.numTries } guesses.`);
      return false;
    }

    num = parseInt(num);
    // Do not penalize the player for duplicate guesses
    if(_.find(this.history, item => {
      return item === num;
    })) {
      console.log(`You already guessed ${ num }. Please try again. You still have ${ this.numTries } guesses.`);
      return false;
    }

    // Store a history of guesses
    this.history.push(num);
    if(num === this.target) {
      console.log(`${ num } was the correct answer! Congratulations!`);
      this.active = false;
      console.log('Play again? (yes/no)');
      return;
    }

    this.numTries--;
    if(this.numTries === 0) {
      console.log(`Sorry, you have no more tries remaining.`);
      this.active = false;
      console.log('Play again? (yes/no)');
      return
    }
    let hint;
    if(num > this.target) {
      hint = 'too high';
    } else {
      hint = 'too low';
    }
    console.log(`${ num } was not the correct number (your guess was ${ hint }). ${ this.numTries } guesses remaining.`);
    console.log('Previous guesses:', this.history);
  }
}

let game = new GuessNumberGame(100, 10);

input.on('line', function(line) {
  if(game.active) {
    game.guess(line);
  } else {
    if(line == 'yes') {
      game.reset();
    } else if(line == 'no'){
      process.exit(0);
    }
  }

});
