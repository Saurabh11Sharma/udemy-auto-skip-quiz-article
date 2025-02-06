let isActive = false; // Tracks the extension's state

// Listen for toggle message from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle") {
        isActive = !isActive;

        // Start or stop content script execution based on state
        if (isActive) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const tabId = tabs[0].id;
                    // Execute content script
                    chrome.scripting.executeScript({
                        target: { tabId },
                        files: ["content.js"],
                    }, () => {
                        // Send message to content.js to start auto-skip
                        chrome.tabs.sendMessage(tabId, { action: "start" });
                    });
                }
            });
        } else {
            // Stop the auto-skip if it's active
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const tabId = tabs[0].id;
                    // Send message to content.js to stop auto-skip
                    chrome.tabs.sendMessage(tabId, { action: "stop" });
                }
            });
        }

        sendResponse({ active: isActive });
    } else if (message.action === "getStatus") {
        sendResponse({ active: isActive });
    }
});
