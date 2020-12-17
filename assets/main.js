let arenaTopHeight = 0;
let arenaBottomHeight = 600;
let arenaWidth = 900;
let paddleHeight = 85;
let paddleWidth = 12;
let ballRadius = 15;
let speedOfPaddle1 = 0;
let positionOfPaddle1 = (arenaBottomHeight / 2 - paddleHeight / 2);
let speedOfPaddle2 = 0;
let positionOfPaddle2 = (arenaBottomHeight / 2 - paddleHeight / 2);
let topPositionOfBall;
let leftPositionOfBall;
let topSpeedOfBall = 0;
let leftSpeedOfBall = 0;
let speedConstant = 10;
let zeroSpeed = 0;
let score1 = Number(window.localStorage.getItem('score1')) || 0;
let score2 = Number(window.localStorage.getItem('score2')) || 0;
let side;
let scoreAudio = new Audio("./assets/audio/score.wav");
let wallBounceAudio = new Audio("./assets/audio/wallbounce.wav");
let paddleBounceAudio = new Audio("./assets/audio/paddlebounce.wav");
let newInterval;
const winningScore = 5;

const startBall = () => {
	topPositionOfBall = (arenaBottomHeight / 2 - (ballRadius / 2));
	leftPositionOfBall = (arenaWidth / 2 - (ballRadius / 2));
	randomizeStartingSide();
	topSpeedOfBall = speedConstant;
	leftSpeedOfBall = side * speedConstant;
};

const randomizeStartingSide = () => {
	if (Math.random() < 0.5) {
		side = 1;
	} else {
		side = -1;
	}
}

document.addEventListener('keydown', (event) => {
	if (event.key === 'w' || event.keyCode === 87) {
		speedOfPaddle1 = -speedConstant;
	}
	if (event.key === 's' || event.keyCode === 83) {
		speedOfPaddle1 = speedConstant;
	}
	if (event.key === 'ArrowUp' || event.keyCode === 38) {
		speedOfPaddle2 = -speedConstant;
	}
	if (event.key === 'ArrowDown' || event.keyCode === 40) {
		speedOfPaddle2 = speedConstant;
	}
	if (event.key === 'r') {
		location.reload();
	}
	if (event.key === 'c') {
		autoPlayOne();
	}
	if (event.key === 'v') {
		autoPlayTwo();
	}

}, false);

document.addEventListener('keyup', (event) => {
	if (event.key === 'w' || event.keyCode === 87) {
		speedOfPaddle1 = zeroSpeed;
	}
	if (event.key === 's' || event.keyCode === 83) {
		speedOfPaddle1 = zeroSpeed;
	}
	if (event.key === 'ArrowUp' || event.keyCode === 38) {
		speedOfPaddle2 = zeroSpeed;
	}
	if (event.key === 'ArrowDown' || event.keyCode === 40) {
		speedOfPaddle2 = zeroSpeed;
	}
}, false);

const intervalCallBack = () => {
	positionOfPaddle1 += speedOfPaddle1;
	positionOfPaddle2 += speedOfPaddle2;
	topPositionOfBall += topSpeedOfBall;
	leftPositionOfBall += leftSpeedOfBall;

	if (positionOfPaddle1 <= arenaTopHeight) {
		positionOfPaddle1 = arenaTopHeight;
	}
	if (positionOfPaddle2 <= arenaTopHeight) {
		positionOfPaddle2 = arenaTopHeight;
	}
	if (positionOfPaddle1 >= arenaBottomHeight - paddleHeight) {
		positionOfPaddle1 = arenaBottomHeight - paddleHeight;
	}
	if (positionOfPaddle2 > arenaBottomHeight - paddleHeight) {
		positionOfPaddle2 = arenaBottomHeight - paddleHeight;
	}
	if (topPositionOfBall <= arenaTopHeight + ballRadius || topPositionOfBall >= arenaBottomHeight - ballRadius) {
		topSpeedOfBall = -topSpeedOfBall;
		wallBounceAudio.play();
	}

	if (leftPositionOfBall <= paddleWidth + ballRadius) {
		if (topPositionOfBall >= positionOfPaddle1 && topPositionOfBall <= positionOfPaddle1 + paddleHeight) {
			leftSpeedOfBall = -leftSpeedOfBall;
			paddleBounceAudio.play();
		} else {
			score2++;
			window.localStorage.setItem('score2', score2.toString());
			startBall();
			scoreAudio.play();
			positionOfPaddle1 = (arenaBottomHeight / 2 - paddleHeight / 2);
			positionOfPaddle2 = (arenaBottomHeight / 2 - paddleHeight / 2);
			victoryChecker();
		}
	}

	if (leftPositionOfBall >= arenaWidth - ballRadius - paddleWidth) {
		if (topPositionOfBall >= positionOfPaddle2 && topPositionOfBall <= positionOfPaddle2 + paddleHeight) {
			leftSpeedOfBall = -leftSpeedOfBall;
			paddleBounceAudio.play();
		} else {
			score1++;
			window.localStorage.setItem('score1', score1.toString());
			positionOfPaddle1 = (arenaBottomHeight / 2 - paddleHeight / 2);
			positionOfPaddle2 = (arenaBottomHeight / 2 - paddleHeight / 2);
			scoreAudio.play();
			startBall();
			victoryChecker();
		}
	}

	document.getElementById("paddle1").style.top = (positionOfPaddle1) + "px";
	document.getElementById("paddle2").style.top = (positionOfPaddle2) + "px";
	document.getElementById("ball").style.top = (topPositionOfBall) + "px";

	document.getElementById("ball").style.left = (leftPositionOfBall) + "px";

	document.getElementById('score1').innerHTML = score1.toString();
	document.getElementById('score2').innerHTML = score2.toString();
};

const positionUpdateInterval = setInterval(intervalCallBack, 50);


const victoryChecker = () => {
	if (score1 === winningScore || score2 === winningScore) {
		clearInterval(positionUpdateInterval);
		endGame();
	}
};

const autoPlayOne = () => {
	setInterval(() => {
		positionOfPaddle1 = topPositionOfBall - paddleHeight / 2;
	}, 25);
};
const autoPlayTwo = () => {
	setInterval(() => {
		positionOfPaddle2 = topPositionOfBall - paddleHeight / 2;
	}, 25);
};

const startGame = () => {

	continueGame();

	const endGameContainer = document.getElementById('endGameContainer');
	const modal = document.getElementById('modal');

	endGameContainer.classList.add('hide');

	document.addEventListener('keyup', (event) => {
		if (event.key === 'enter' || event.keyCode === 13) {
			modal.classList.add('hide');

			startBall();
		}
	});
};

const endGame = () => {
	const endGameContainer = document.getElementById('endGameContainer');
	const endGameContainerParagraph = document.querySelector('.end-game-container p');
	const modal = document.getElementById('modal');
	const startGameContainer = document.getElementById('startGameContainer');
	const restartBtn = document.getElementById('restart');

	modal.classList.remove('hide');
	endGameContainer.classList.remove('hide');
	startGameContainer.classList.add('hide');

	clearInterval(newInterval);

	endGameContainerParagraph.textContent = `${score1 === winningScore ? 'Player 1' : 'Player 2'} wins!`;

	score1 = 0;
	score2 = 0;
	window.localStorage.setItem('score1', score1.toString());
	window.localStorage.setItem('score2', score2.toString());

	restartBtn.addEventListener('click', () => {
		modal.classList.add('hide');

		clearInterval(newInterval);

		newInterval = setInterval(intervalCallBack, 50);

		startBall();
	});
};

const continueGame = () => {

	const startingMessage = document.querySelector('.start-game-container p');
	const isSavedToLocalStorage = (Number(window.localStorage.getItem('score1')) !== 0) || (Number(window.localStorage.getItem('score2')) !== 0);

	if (isSavedToLocalStorage) {
		startingMessage.innerHTML = `Press <strong>'Enter'</strong> to continue the game.`;
	} else {
		startingMessage.innerHTML = `Press <strong>'Enter'</strong> to start the game.`;
	}

};

startGame();
