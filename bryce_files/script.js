let elements;
let initialText;
let terminalHistory = sessionStorage.getItem("terminalHistory") ? JSON.parse(sessionStorage.getItem("terminalHistory")) : [];
let terminalHistoryIndex = terminalHistory.length;
function onLoad() {
  setTimeout(() => {
    scrollToTopLeft();
  }, 100);

  if (
    !sessionStorage.getItem("hasLoadedOnce") ||
    performance.navigation.type === performance.navigation.TYPE_RELOAD
  ) {
    const asciiName = document.querySelector(".ascii-name");
    const glitchElements = document.querySelectorAll(".ascii-name-glitch");
    elements = [asciiName, ...glitchElements];
    initialText = asciiName.getAttribute("data-text");
    showLoadingAnimation(elements, initialText);
    sessionStorage.setItem("hasLoadedOnce", "true");
  }
}

function showLoadingAnimation(elements, initialText) {
  const loading = document.createElement("div");
  loading.classList.add("loading");
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
        currentLetterIndex++;
        nextLetterIndex += 2;
        scramble();
      } else {
        let elapsedTime = Date.now() - scrambleStartTime;
        if (elapsedTime < duration) {
          let scrambledRemainder = originalText
            .slice(currentLetterIndex + 1)
            .split("")
            .map((char) => {
              return char === " " ? " " : randomChar();
            })
            .join("");

          currentScramble =
            originalText.slice(0, currentLetterIndex) +
            randomChar() +
            scrambledRemainder;
          elements.forEach((el) => (el.textContent = currentScramble));
          setTimeout(scramble, 70);
        } else {
          currentScramble =
            originalText.slice(0, currentLetterIndex + 1) +
            originalText
              .slice(currentLetterIndex + 1)
              .replace(/[^ ]/g, randomChar());
          elements.forEach((el) => (el.textContent = currentScramble));
          currentLetterIndex++;
          nextLetterIndex++;
          scrambleStartTime = Date.now();
          if (nextLetterIndex < originalText.length) {
            requestAnimationFrame(scramble);
          } else {
            if (
              nextLetterIndex === originalText.length &&
              originalText[currentLetterIndex] !== " "
            ) {
              currentScramble =
                originalText.slice(0, currentLetterIndex) + randomChar();
              elements.forEach((el) => (el.textContent = currentScramble));
              setTimeout(() => {
                currentScramble = originalText;
                elements.forEach((el) => (el.textContent = currentScramble));
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
    const terminal = document.querySelector(".terminal");
    terminal &&
      terminal.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, 10);
}

function focusTerminalInput() {
  const terminalInput = document.querySelector(".input-field");
  if (terminalInput) {
    terminalInput.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => terminalInput.focus(), 300);
  }
}

window.addEventListener("load", onLoad);

const inputField = document.querySelector(".input-field");

inputField.addEventListener("keydown", (e) => {
  e.preventDefault();
  focusTerminalInput(); 
  if (e.key === "Enter") {
    terminalHistory.push(inputField.value);
    terminalHistoryIndex = terminalHistory.length;
    sessionStorage.setItem("terminalHistory", JSON.stringify(terminalHistory));
    const command = inputField.value.toLowerCase().trim();
    inputField.value = "";
    handleCommand(command);
  } else if (e.key === "ArrowUp") {
    if(terminalHistory.length > 0 && terminalHistoryIndex > 0) {
      terminalHistoryIndex--;
      inputField.value = terminalHistory[terminalHistoryIndex];
    }
  } else if (e.key === "ArrowDown") {
    if(terminalHistory.length > 0 && terminalHistoryIndex < terminalHistory.length - 1) {
      terminalHistoryIndex++;
      inputField.value = terminalHistory[terminalHistoryIndex];
    }
  } else {
    handleKeydown(e);
  }
});

function handleCommand(command) {
  const commands = {
    0: "index.html",
    main: "index.html",
    1: "about.html",
    "about me": "about.html",
    2: "articles.html",
    articles: "articles.html",
    3: "experience.html",
    experience: "experience.html",
    4: "projects.html",
    projects: "projects.html",
    5: "social.html",
    socials: "social.html",
    6: "fizzbuzz.html",
    fizzbuzz: "fizzbuzz.html",
  };
  const url = commands[command];
  let terminal = document.querySelector(".terminal-content");
  if (!terminal) terminal = document.querySelector(".about-content");
  if (url) {
    terminal.classList.remove("fade-in");
    terminal.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = url;
    }, 301);
  } else {
    alert(
      "Segmentation Fault (Core Dumped) - Nah just kidding, that command doesn't exist. Try again!"
    );
  }
}

function handleKeydown(e) {
  let cursorPos = inputField.selectionStart;
  let keyCode = e.keyCode;

  if (keyCode === 8 && cursorPos > 0) {
    // Handle Backspace key
    inputField.value = inputField.value.slice(0, cursorPos - 1) + inputField.value.slice(cursorPos);
    inputField.setSelectionRange(cursorPos - 1, cursorPos - 1);
  } else if (keyCode === 37 && cursorPos > 0) {
    // Handle Arrow Left key
    inputField.setSelectionRange(cursorPos - 1, cursorPos - 1);
  } else if (keyCode === 39 && cursorPos < inputField.value.length) {
    // Handle Arrow Right key
    inputField.setSelectionRange(cursorPos + 1, cursorPos + 1);
  } else if (
    (keyCode > 47 && keyCode < 58) ||
    (keyCode > 64 && keyCode < 91) ||
    (keyCode >= 96 && keyCode < 123) ||
    keyCode === 32
  ) {
    // Handle other valid keys
    const inputValue = inputField.value;
    const newValue = inputValue.slice(0, cursorPos) + e.key + inputValue.slice(cursorPos);
    inputField.value = newValue;
    inputField.setSelectionRange(cursorPos + 1, cursorPos + 1);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let terminal = document.querySelector(".terminal-content");
  if (!terminal) terminal = document.querySelector(".about-content");

  terminal.classList.add("fade-in");
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  const fizzbuzz = document.querySelector(".fizzbuzz-output");
  let iter = 0;

  // FizzBuzz code as a formatted string
  const fizzbuzzCode = `#include <iostream>

int main() {
    for(int i = 1; i <= 100; ++i) {
        if(i % 3 == 0 && i % 5 == 0) {
            std::cout << "FizzBuzz\\n";
        } else if(i % 3 == 0) {
            std::cout << "Fizz\\n";
        } else if(i % 5 == 0) {
            std::cout << "Buzz\\n";
        } else {
            std::cout << i << "\\n";
        }
    }
    return 0;
}`;

  if (fizzbuzz) {
    fizzbuzz.addEventListener("keydown", (e) => {
      e.preventDefault(); // Prevent default key behavior
      if (e.key === "Escape" || e.key === "Enter") {
        focusTerminalInput();
      } else if (iter >= fizzbuzzCode.length) {
        return;
      } else if (e.key === "Backspace") {
        fizzbuzz.value = fizzbuzz.value.slice(0, -1);
      } else {
        if (fizzbuzzCode[iter] === " ") {
          iter = skipEmpty(iter, fizzbuzzCode, fizzbuzz);
        }
        if (iter < fizzbuzzCode.length) {
          fizzbuzz.value += fizzbuzzCode[iter];
          iter++;
        }
      }
    });
    fizzbuzz.addEventListener("unload", (e) => {
      iter = 0;
      fizzbuzz.value = "";
    });
  }
});

function focusFizzBuzzInput(event) {
  if (document.getElementById("fizzbuzz-output") !== null) {
  event.stopPropagation(); 
}
  const fizz = document.querySelector(".fizzbuzz-output");
  if (fizz) {
    fizz.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => fizz.focus(), 300);
  }
}

function skipEmpty(iter, fizzBuzzCode, fizzbuzz) {
  while (iter < fizzBuzzCode.length && fizzBuzzCode[iter] === " ") {
    fizzbuzz.value += fizzBuzzCode[iter];
    iter++;
  }
  // Return the updated iter value
  return iter;
}
