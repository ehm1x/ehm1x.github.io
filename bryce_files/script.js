let elements;
let initialText;

function onLoad() {
    scrollToTopLeft();
  
	if (!sessionStorage.getItem("hasLoadedOnce") || (performance.navigation.type === performance.navigation.TYPE_RELOAD)) {
        const asciiName = document.querySelector('.ascii-name');
        const glitchElements = document.querySelectorAll('.ascii-name-glitch');
        elements = [asciiName, ...glitchElements]; // Now accessible in a higher scope
        initialText = asciiName.getAttribute('data-text'); // Now accessible in a higher scope
        showLoadingAnimation(elements, initialText); // Pass as parameters
        sessionStorage.setItem("hasLoadedOnce", "true");
	}
}

window.addEventListener("load", onLoad);

window.onload = function() {
    scrollToTopLeft();
};

function showLoadingAnimation(elements, initialText) {
    const loading = document.createElement('div');
    loading.classList.add('loading');
    loading.innerHTML = '<div class="loading-screen"><h1>Loading...</h1></div>';
    document.body.appendChild(loading);

    setTimeout(() => {
        loading.remove();
		scrambleText(elements, initialText, 140, function () {
			console.log("Scramble animation completed");
		});
    }, 1000);
}

function scrollToTopLeft() {
	setTimeout(() => {
        const terminal = document.querySelector('.terminal');
		terminal.scrollTop = 0;
		terminal.scrollLeft = 0;
    }, 10); 
	window.scrollTo(0, 0);
}

const inputField = document.querySelector('.input-field');

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = inputField.value.toLowerCase().trim();
        inputField.value = '';

        switch (command) {
            case '1':
            case 'about me':
                window.location.href = 'about.html';
				scrollToTopLeft();
                break;
            case '2':
            case 'education':
                window.location.href = 'education.html';
				scrollToTopLeft();
                break;
            case '3':
            case 'experience':
                window.location.href = 'experience.html';
				scrollToTopLeft();
                break;
            case '4':
            case 'projects':
                window.location.href = 'projects.html';
				scrollToTopLeft();
                break;
            case '5':
            case 'socials':
                window.location.href = 'social.html';
				scrollToTopLeft();
                break;
			case '0':
			case 'main':
                window.location.href = 'bryce.html';
				scrollToTopLeft();
                break;
            default:
                alert('Invalid command. Please enter a valid option.');
        }
	}
});

function scrambleText(targetElement, originalText, duration, callback) {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let currentScramble = "";
  let currentLetterIndex = 0;
  let nextLetterIndex = 0;
  let scrambleStartTime;

    function randomChar() {
		return chars[Math.floor(Math.random() * chars.length)];
	}

	function scramble() {
	  if (nextLetterIndex < originalText.length) {
		if (originalText[nextLetterIndex] === " ") {
		  currentScramble += " ";
		  nextLetterIndex++;
		  scramble();
		} else {
		  let elapsedTime = Date.now() - scrambleStartTime;
		  if (elapsedTime < duration) {
			// Scramble the current character and the remaining characters
			let scrambledRemainder = originalText.slice(currentLetterIndex + 1).split('').map(char => {
			  return char === ' ' ? ' ' : randomChar();
			}).join('');

			if (originalText[currentLetterIndex] === ' ') {
			  currentScramble = originalText.slice(0, currentLetterIndex) + ' ' + scrambledRemainder;
			} else {
			  currentScramble = originalText.slice(0, currentLetterIndex) + randomChar() + scrambledRemainder;
			}
			targetElement.forEach(el => el.textContent = currentScramble);
			setTimeout(scramble, 70); // Slow down the swapping of random characters
		  } else {
			currentScramble = originalText.slice(0, currentLetterIndex + 1) + originalText.slice(currentLetterIndex + 1).replace(/[^ ]/g, randomChar());

			targetElement.forEach(el => el.textContent = currentScramble);
			currentLetterIndex++;
			nextLetterIndex++;
			scrambleStartTime = Date.now();
			if (nextLetterIndex < originalText.length) {
			  requestAnimationFrame(scramble);
			} else {
			  if (nextLetterIndex === originalText.length && originalText[currentLetterIndex] !== ' ') {
				currentScramble = originalText.slice(0, currentLetterIndex) + randomChar();
				targetElement.forEach(el => el.textContent = currentScramble);
				setTimeout(() => {
				  currentScramble = originalText;
				  targetElement.forEach(el => el.textContent = currentScramble);
				  callback();
				}, 70);
			  } else {
				callback();
			  }
			}
		  }
		}
	  }
	}
  scrambleStartTime = Date.now();
  requestAnimationFrame(scramble);
}

function focusTerminalInput() {
    const terminalInput = document.querySelector('.input-field');
    if (terminalInput) {
        terminalInput.focus();
    }
}