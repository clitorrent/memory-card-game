"use strict";
// consts to store card symbols and score panel elements
const c1 = "<i class='far fa-paper-plane'></i>";
const c2 = "<i class='fa fa-anchor'></i>";
const c3 = "<i class='fa fa-bolt'></i>";
const c4 = "<i class='far fa-gem'></i>";
const c5 = "<i class='fa fa-bicycle'></i>";
const c6 = "<i class='fa fa-bomb'></i>";
const c7 = "<i class='fa fa-leaf'></i>";
const c8 = "<i class='fa fa-cube'></i>";
const restartBtn = document.querySelector('.restart');
const movesBtn = document.querySelector('.moves');
const timerelement = document.querySelector(".timer");
// count is for amount of clicks from the start of the game
let count = 0;
// click is for constrain more than two consequent clicks on the deck
let click = 0;
//oclArr is for open card list array
let oclArr = [];
//prevCard is for storing 1st clicked card within two clicked cards
let prevCard;
//intervalID is needed to clear timer later after finishing or restarting a game
let intervalID;

//game page init on load
makeDeck(makeCardsArray());
addClickListeners();
starRating();

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// create a list that holds all of your cards
function makeCardsArray() {
	let i = 0;
	let cardholder = [];
	while (i < 2) {
		cardholder.push(c1, c2, c3, c4, c5, c6, c7, c8);
	i++;
	};
	shuffle(cardholder);
	return cardholder;
}
// add html with cards to the page
function makeDeck(array) {
	const fragment = document.createDocumentFragment();
	let deck = document.querySelector('.deck');
	while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
	};
	for ( let value of array) {
		const listel = document.createElement('li');
		listel.classList.add('card');
		listel.innerHTML = value;
		fragment.appendChild(listel);
	};
	deck.appendChild(fragment);
}

// add 'click' event listener to the cards
function addClickListeners() {
	let cards = document.querySelectorAll('.card');
	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener('click', clickCard);
	};
}

// rebuilding the deck with new cards when clicking restart
restartBtn.addEventListener('click', () => {
	setTimeout(() => {
		makeDeck(makeCardsArray());
		addClickListeners();
		resetStars();
		stopTimer();
		timerelement.innerHTML = 0;
		oclArr = [];
		count = 0;
		movesBtn.innerHTML = 0;
	}, 300);
});

// display the card's symbol and other actions
function clickCard (event) {
	//block cards clicks on the deck to prevent three or more cards show simultaneously
	click += 1;
	 if (click >= 2) {
		blockClicks();
		setTimeout(allowClicks, 400);
		click = 0;
	 } else {
		allowClicks();
	 }
	event.preventDefault();
	event.target.classList.toggle('open');
	event.target.classList.toggle('show');
	// block card to handle more than one click
	event.target.removeEventListener('click', clickCard);
	addtoOpenCardList(event.target);
	clicksCount();
	starRating();
	// fires a winner modal window if all the cards are matched
	if (oclArr.length === 16) {
		stopTimer();
		winnerPopUp();
	}
	// stars timer after first click in a game
	if (count === 1) {
		startTimer();
		prevCard = event.target;
	}
	// check if cards match after every second card click on the deck
	if (count % 2 === 0) {
		cardsMatch(event);
	} else {
		prevCard = event.target;
	}
}
// add cards to open cards list array
function addtoOpenCardList (card) {
	oclArr.push(card.firstElementChild);
}
// add moves count to the score panel
function moves(count) {
	if (count % 2 === 0) {
		return count / 2;
	} else {
		return count / 2 - 0.5;
	}
}
// add overall clicks count and output them in the score panel
function clicksCount () {
	count += 1;
	movesBtn.innerHTML = moves(count);
	return count;
}
// function to handle if cards match condition and add animation if they match or not
function cardsMatch (event) {
	if (!(event.target.innerHTML === prevCard.innerHTML)) {
		setTimeout(() => {
			prevCard.classList.remove('no-matched');
			event.target.classList.remove('no-matched');
			prevCard.classList.toggle('show');
			event.target.classList.toggle('show');
			prevCard.classList.toggle('open');
			event.target.classList.toggle('open');
			prevCard.addEventListener('click', clickCard);
			event.target.addEventListener('click', clickCard);
			oclArr.pop();
			oclArr.pop();
			return prevCard = "";
		}, 400);
		setTimeout(() => {
			prevCard.classList.add('no-matched');
			event.target.classList.add('no-matched');
		}, 100)
	} else {
		setTimeout(() => {
			prevCard.classList.remove('matched');
			event.target.classList.remove('matched');
			prevCard.classList.add('match');
			event.target.classList.add('match');
		}, 400);
		setTimeout(() => {
			prevCard.classList.add('matched');
			event.target.classList.add('matched');
		}, 100);
	}
}
// function to block all the cards clicks on the deck 
function blockClicks () {
	let cards = document.querySelectorAll('.card');
	for (let i = 0; i < cards.length; i++) {
		cards[i].classList.add('noclicks');
	};
}
// function to allow all the card clicks on the deck
function allowClicks () {
	let cards = document.querySelectorAll('.card');
	for (let i = 0; i < cards.length; i++) {
		cards[i].classList.remove('noclicks');
	};
}
// star rating condition handle
function starRating () {
	let stars = document.querySelectorAll('.stars li i');
	if (count === 26) {
		stars[2].classList.remove('fas', 'fa-star');
		stars[2].classList.add('far', 'fa-star');
	}
	else if (count === 32) {
		stars[1].classList.remove('fas', 'fa-star');
		stars[1].classList.add('far', 'fa-star');
	}
	else if (count === 38) {
		stars[0].classList.remove('fas', 'fa-star');
		stars[0].classList.add('far', 'fa-star');
	}
}
// reset star rating on the score panel
function resetStars () {
	let sts = document.querySelector('.stars')
	let li = '<li><i class="fas fa-star"></i></li>'
	sts.innerHTML = `${li} ${li} ${li}`;
}
// timer to output on the score panel
function startTimer() {
	let startTime = Date.now();
	intervalID = setInterval(function() {
		let elapsedTime = Date.now() - startTime;
		document.querySelector(".timer").innerHTML = (elapsedTime / 1000).toFixed(1);
	}, 100);	
}
// stop timer function
function stopTimer () {
	clearInterval(intervalID);
}
// function to show winner modal popup window
function winnerPopUp () {
	let starshtml = document.querySelector('.stars').innerHTML;
	let moveshtml = document.querySelector('.moves');
	let timerhtml = document.querySelector('.timer');
	document.querySelector('.m-stars').innerHTML = starshtml;
	document.querySelector('.m-moves').innerHTML = moveshtml.innerHTML;
	document.querySelector('.m-time').innerHTML = timerhtml.innerHTML;
	$('#win-window').modal({
		fadeDuration: 300
	});
}