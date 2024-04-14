document.getElementById("unblockSite").addEventListener("click", function() {
    // Send a message to the background script to unblock the current site
    chrome.runtime.sendMessage({ message: "unblockSite" });
    // Close the blocked page
    window.close();
});
