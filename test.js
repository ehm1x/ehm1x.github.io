// Ensure the variables are available in the scope where showLoadingAnimation is defined
let elements;
let initialText;

function onLoad() {
    scrollToTopLeft();
  
    // Check if the page has been loaded before
    if (!sessionStorage.getItem("hasLoadedOnce") || (performance.navigation.type === performance.navigation.TYPE_RELOAD)) {
        const asciiName = document.querySelector('.ascii-name');
        const glitchElements = document.querySelectorAll('.ascii-name-glitch');
        
        // Assign the elements to the global variables
        elements = [asciiName, ...glitchElements];
        initialText = asciiName.getAttribute('data-text');
        
        // Pass the global variables to the showLoadingAnimation function
        showLoadingAnimation(elements, initialText);
        
        // Set the session storage to indicate the page has loaded once
        sessionStorage.setItem("hasLoadedOnce", "true");
    }
}

// Attach the onLoad function to the window load event
window.addEventListener("load", onLoad);

// Additional window.onload is not necessary since you already have the load event listener
// If you need additional load logic, include it in the onLoad function above

function showLoadingAnimation(elements, initialText) {
    // Your showLoadingAnimation logic
    // ...
    
    // Start the loading animation after a delay
    setTimeout(() => {
        loading.remove();
        scrambleText(elements, initialText, 140, function () {
            console.log("Scramble animation completed");
        });
    }, 1000);
}

function scrollToTopLeft() {
    // Your scrollToTopLeft logic
    // ...
}

// Rest of your event listeners and functions
// ...

function scrambleText(targetElement, originalText, duration, callback) {
  // Your scrambleText logic
  // ...
}

function focusTerminalInput() {
    // Your focusTerminalInput logic
    // ...
}