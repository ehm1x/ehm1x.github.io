let elements;
let initialText;

function onLoad() {
    scrollToTopLeft();

    if (!sessionStorage.getItem("hasLoadedOnce") || (performance.navigation.type === performance.navigation.TYPE_RELOAD)) {
        const asciiName = document.querySelector('.ascii-name');
        const glitchElements = document.querySelectorAll('.ascii-name-glitch');
        elements = [asciiName, ...glitchElements];
        initialText = asciiName.getAttribute('data-text'); 
        showLoadingAnimation(elements, initialText); 
        sessionStorage.setItem("hasLoadedOnce", "true");
    }

    let terminal = document.querySelector('.terminal');
    terminal.classList.add('fade-in');
  
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.target !== '_blank') {
                e.preventDefault();
                const newUrl = this.getAttribute('href');
                terminal.classList.add('fade-out');
                setTimeout(() => {
                    window.location = newUrl;
                }, 500);
            }
        });
    });
}

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

function scrambleText(elements, originalText, duration, callback) {
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
                    let scrambledRemainder = originalText.slice(currentLetterIndex + 1).split('').map(char => {
                        return char === ' ' ? ' ' : randomChar();
                    }).join('');

                    currentScramble = originalText.slice(0, currentLetterIndex) + randomChar() + scrambledRemainder;
                    elements.forEach(el => el.textContent = currentScramble);
                    setTimeout(scramble, 70);
                } else {
                    currentScramble = originalText.slice(0, currentLetterIndex + 1) + originalText.slice(currentLetterIndex + 1).replace(/[^ ]/g, randomChar());
                    elements.forEach(el => el.textContent = currentScramble);
                    currentLetterIndex++;
                    nextLetterIndex++;
                    scrambleStartTime = Date.now();
                    if (nextLetterIndex < originalText.length) {
                        requestAnimationFrame(scramble);
                    } else {
                        if (nextLetterIndex === originalText.length && originalText[currentLetterIndex] !== ' ') {
                            currentScramble = originalText.slice(0, currentLetterIndex) + randomChar();
                            elements.forEach(el => el.textContent = currentScramble);
                            setTimeout(() => {
                                currentScramble = originalText;
                                elements.forEach(el => el.textContent = currentScramble);
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
    scramble();
}

function scrollToTopLeft() {
    setTimeout(() => {
        const terminal = document.querySelector('.terminal');
        terminal && terminal.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, 10);
}

function focusTerminalInput() {
    const terminalInput = document.querySelector('.input-field');
    if (terminalInput) {
        terminalInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => terminalInput.focus(), 300);
    }
}

window.addEventListener("load", onLoad);

const inputField = document.querySelector('.input-field');

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = inputField.value.toLowerCase().trim();
        inputField.value = '';
        handleCommand(command);
    } else {
        handleKeydown(e);
    }
});

function handleCommand(command) {
    const commands = {
        '1': 'about.html',
        'about me': 'about.html',
        '2': 'articles.html',
        'articles': 'articles.html',
        '3': 'experience.html',
        'experience': 'experience.html',
        '4': 'projects.html',
        'projects': 'projects.html',
        '5': 'social.html',
        'socials': 'social.html',
        '0': 'index.html',
        'main': 'index.html'
    };
    const url = commands[command];
    if (url) {
        window.location.href = url;
        scrollToTopLeft();
    } else {
        alert('Segmentation Fault (Core Dumped) - Nah just kidding, that command doesn\'t exist. Try again!');
    }
}

function handleKeydown(e) {
    e.preventDefault();
    let keyCode = e.keyCode;
    if (keyCode === 8 && inputField.value.length > 0) {
        inputField.value = inputField.value.slice(0, -1);
    } else if (
        (keyCode > 47 && keyCode < 58) ||
        (keyCode > 64 && keyCode < 91) ||
        (keyCode > 96 && keyCode < 123) ||
        keyCode === 32
    ) {
        inputField.value += e.key;
    }
    focusTerminalInput();
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});