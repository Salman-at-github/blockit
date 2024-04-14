// Listen for install event
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for incoming requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "checkBlockedSites") {
        // Check if the current tab's URL or its main host is present in blockedSites
        chrome.storage.local.get('blockedSites', (data) => {
            const blockedSites = data.blockedSites || [];
            const currentUrl = new URL(sender.tab.url);
            const mainHost = currentUrl.protocol + "//" + currentUrl.hostname;

            if (blockedSites.includes(currentUrl.href) || blockedSites.includes(mainHost)) {
                // Redirect to blocked_page.html
                chrome.tabs.update(sender.tab.id, { url: chrome.runtime.getURL("blocked_page.html") });
            }
        });
    }
});

// Listen for tab change events
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab URL or its main host is present in blockedSites
    chrome.storage.local.get('blockedSites', (data) => {
        const blockedSites = data.blockedSites || [];
        const currentUrl = new URL(tab.url);
        const mainHost = currentUrl.protocol + "//" + currentUrl.hostname;

        if (blockedSites.includes(currentUrl.href) || blockedSites.includes(mainHost)) {
            // Redirect to blocked_page.html
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked_page.html") });
        }
    });
});
