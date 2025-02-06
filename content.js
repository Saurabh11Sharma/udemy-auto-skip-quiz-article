(function () {
    // Check if the auto-skip is already initialized
    if (window.udemyAutoSkipInitialized) {
        console.log("Udemy Auto-Skip: Script already initialized.");
        return;
    }
    window.udemyAutoSkipInitialized = true;

    let intervalId = null;

    // Function to skip quizzes and articles
    function skipOrContinue() {
        try {
            const nextButton = document.querySelector('[data-purpose="go-to-next"]'); // The "Next" button selector
            const currentTitle = document.querySelector('.curriculum-item-link--title')?.textContent || '';
            const videoElement = document.querySelector('video');
            const isQuizOrArticle = !videoElement || /quiz|article/i.test(currentTitle);

            console.log(`Current Title: ${currentTitle}`);
            console.log(`Is Quiz or Article: ${isQuizOrArticle}`);

            // Skip if it's a quiz or article and the next button is available
            if (isQuizOrArticle && nextButton) {
                console.log("Udemy Auto-Skip: Skipping to the next lecture...");
                nextButton.click();  // Simulate clicking the 'Next' button
            } else if (videoElement) {
                console.log("Udemy Auto-Skip: Watching video, no action needed.");
            } else {
                console.log("Udemy Auto-Skip: Current content is neither video nor quiz/article.");
            }
        } catch (error) {
            console.error("Udemy Auto-Skip Error:", error.message);
            stopAutoSkip(); // Stop auto-skip on error
        }
    }

    // Start the auto-skip interval
    function startAutoSkip() {
        if (intervalId) {
            console.log("Udemy Auto-Skip: Already active.");
            return;
        }

        console.log("Udemy Auto-Skip: Activated");
        intervalId = setInterval(skipOrContinue, 3000); // Check every 3 seconds
    }

    // Stop the auto-skip interval
    function stopAutoSkip() {
        if (intervalId) {
            console.log("Udemy Auto-Skip: Deactivated");
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Listen for messages from background script to start/stop
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "start") {
            startAutoSkip();
        } else if (message.action === "stop") {
            stopAutoSkip();
        }
    });
})();
