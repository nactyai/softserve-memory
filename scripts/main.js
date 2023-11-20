const move = document.getElementById('moveCount');
const field = document.getElementById('field');
const modalPlayAgain = document.querySelector('.play-again-wrapper');
const modalPlayAgainRes = document.querySelector('.play-again');
const modalStart = document.querySelector('.start-wrapper');
const modalPause = document.querySelector('.pause-wrapper');
const startBtn = document.getElementById('start__btn');
const pauseBtn = document.getElementById('pause__btn');
const resumeBtn = document.getElementById('resume__btn');
const resetBtn = document.getElementById('reset__btn');
const resWinOrLoose = document.createElement('span');
const playAgainBtn = document.createElement('button');
playAgainBtn.id = 'play-again__btn';
playAgainBtn.textContent = 'Play Again ?';

const playSound = document.querySelector('.play-sound');
const audio = document.querySelector('#audio');
const svgOn = document.querySelector('.sound-on');
const svgOff = document.querySelector('.sound-off');



const openCards = [];
const allCards = [];
const resCard = [];


let countCard = 0;
let openedCardPairs = 0;
let remainingSeconds = 60;
let modalStartClosed = false;
let intervalId;
let paused = false;



function createCard(item) {

  class Card {
    constructor() {
      this.card = document.createElement('div');
      this.card.classList.add('card');

      this.front = document.createElement('div');
      this.front.classList.add('card__face', 'card__face--front');
      this.card.appendChild(this.front);

      this.back = document.createElement('div');
      this.back.classList.add('card__face', 'card__face--back');
      this.card.appendChild(this.back);

      this.img = document.createElement('img');
      this.img.src = item.imgSrc;
      this.back.appendChild(this.img);

      this.card.isFlipped = false;
      this.card.name = item.name;

      this.card.addEventListener('click', () => {
        this.checkIsCardFlipped();
      });
    }

    checkIsCardFlipped() {

      if (!this.card.isFlipped && openCards.length < 2) {
        this.card.classList.add('is-flipped');
        this.card.isFlipped = true;
        openCards.push(this.card);

        if (openCards.length === 2) {
          const card1 = openCards[0];
          const card2 = openCards[1];

          countCard++;

          move.innerHTML = ` ${countCard}`;


          if (card1.name === card2.name) {
            openCards.length = 0;
            resCard.push(card1, card2);
            openedCardPairs++;
          }
          else {
            setTimeout(function () {
              card1.classList.remove('is-flipped');
              card2.classList.remove('is-flipped');

              card1.isFlipped = false;
              card2.isFlipped = false;
              openCards.length = 0;
            }, 1000);
          }
        }
      }
    }
  }
  return new Card();
}



function selectUniqueFromAnimals(numberOfCards) {
  const res = new Set();
  while (res.size < numberOfCards) {
    res.add(animals[Math.floor(Math.random() * animals.length)]);
  }
  return res;
}



function iniGame() {
  const numberOfCards = 6;
  const selectedUnique = Array.from(selectUniqueFromAnimals(numberOfCards));
  let dublicateSelectedUnique = [...selectedUnique, ...selectedUnique].map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

  dublicateSelectedUnique.forEach(item => {
    const card = createCard(item);
    field.appendChild(card.card);
    allCards.push({ name: item.name, isFlipped: false });
  });

}
iniGame();


function sound() {
  svgOff.classList.add('hidden');

  if (audio.paused) {
    audio.play();
    svgOn.classList.remove('hidden');
    svgOff.classList.add('hidden');
  } else {
    audio.pause();
    svgOn.classList.add('hidden');
    svgOff.classList.remove('hidden');
  }
}

playSound.addEventListener('click', sound);


function displayModal(message, color) {
  modalPlayAgain.style.display = "block";
  resWinOrLoose.textContent = message;
  resWinOrLoose.style.color = color;
  modalPlayAgainRes.appendChild(resWinOrLoose);
  modalPlayAgainRes.appendChild(playAgainBtn);
  paused = true;
  audio.pause();
  if (intervalId) {
    clearTimeout(intervalId);
  }
}


function gameOver() {
  const isAllFlipped = document.querySelectorAll('.card:not(.is-flipped)').length === 0;

  if (isAllFlipped) {
    displayModal('You Win! Congrats!', 'green');
  }
  else if (remainingSeconds === 0) {
    displayModal('You loose', 'red');
  }
}

function tick() {
  modalPlayAgainRes.innerHTML = '';
  if (!paused && remainingSeconds > 0) {
    remainingSeconds--;
    counter.innerHTML = '0:' + (remainingSeconds < 10 ? '0' : '') + String(remainingSeconds);
    intervalId = setTimeout(tick, 1000);
  }

  gameOver();

}

function reset() {
  countCard = 0;
  move.innerHTML = '';
  openedCardPairs = 0;
  resCard.length = 0;
  openCards.length = 0;

  resCard.forEach(item => {
    item.classList.remove('is-flipped');
    item.isFlipped = false;
  });

  field.innerHTML = '';
  iniGame();
  clearTimeout(intervalId);
  remainingSeconds = 60;
  counter.innerHTML = '1:00';

  paused = false;
}

playAgainBtn.addEventListener('click', function () {
  modalPlayAgain.style.display = "none";
  reset();
  tick();
  audio.play();
});

startBtn.addEventListener('click', function () {
  modalStartClosed = false;
  modalStart.style.display = 'none';
  paused = false;
  sound();
  tick();
});


resetBtn.addEventListener('click', function () {
  reset();
  tick();
});


pauseBtn.addEventListener('click', function () {
  clearTimeout(intervalId);
  paused = true;
  modalPause.style.display = "block";
  audio.pause();

});


resumeBtn.addEventListener('click', function () {
  paused = false;
  modalPause.style.display = "none";
  tick();
  audio.play();
});





