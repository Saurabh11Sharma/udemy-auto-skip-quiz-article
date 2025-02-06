document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("toggle-btn");
    const statusDiv = document.getElementById("status");

    // Get current state from background script
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error fetching status:", chrome.runtime.lastError);
            return;
        }
        updateUI(response.active);
    });

    // Toggle the state of the extension (enable/disable)
    button.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "toggle" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error toggling state:", chrome.runtime.lastError);
                return;
            }
            updateUI(response.active);
        });
    });

    // Update the UI based on the state
    function updateUI(isActive) {
        if (isActive) {
            button.textContent = "Disable Auto-Skip";
            button.style.backgroundColor = "#f44336";
            statusDiv.textContent = "Status: Enabled";
        } else {
            button.textContent = "Enable Auto-Skip";
            button.style.backgroundColor = "#4CAF50";
            statusDiv.textContent = "Status: Disabled";
        }
    }
});