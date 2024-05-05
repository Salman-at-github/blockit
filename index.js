// Function to block a site
async function blockSite(site) {
    try {
        let { blockedSites } = await chrome.storage.sync.get('blockedSites');
        blockedSites = blockedSites || [];
        if (!blockedSites.includes(site)) {
            blockedSites.push(site);
            await chrome.storage.sync.set({ 'blockedSites': blockedSites });
        }
        updateBlockedSites();
    } catch (error) {
        console.error('Error blocking site:', error);
        // Handle error
    }
}

// Function to unblock a site
async function unblockSite(site) {
    try {
        let { blockedSites } = await chrome.storage.sync.get('blockedSites');
        blockedSites = blockedSites || [];
        const index = blockedSites.indexOf(site);
        if (index !== -1) {
            blockedSites.splice(index, 1);
            await chrome.storage.sync.set({ 'blockedSites': blockedSites });
        }
        updateBlockedSites();
    } catch (error) {
        console.error('Error unblocking site:', error);
        // Handle error
    }
}

// Function to update the list of blocked sites in the options page
async function updateBlockedSites() {
    try {
        let { blockedSites } = await chrome.storage.sync.get('blockedSites');
        blockedSites = blockedSites || [];
        let ul = document.getElementById("blockedSites");
        ul.innerHTML = '';
        blockedSites.forEach(function(site) {
            let li = document.createElement("li");
            li.className = "blockedUrl";
            li.textContent = site.length > 25 ? site.substring(0, 25) + "..." : site;
            let button = document.createElement("button");
            button.textContent = "Unblock";
            button.classList.add("unblockButton")
            button.addEventListener("click", async function() {
                await unblockSite(site);
            });
            li.appendChild(button);
            ul.appendChild(li);
        });
    } catch (error) {
        console.error('Error updating blocked sites:', error);
        // Handle error
    }
}

// Event listener for blocking the current site
document.getElementById("blockCurrent").addEventListener("click", async function() {
    try {
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        let url = new URL(tab.url);
        let siteToBlock = url.protocol + "//" + url.hostname; // Get the main host
        await blockSite(siteToBlock);
    } catch (error) {
        console.error('Error blocking current site:', error);
        // Handle error
    }
});

// Event listener for blocking a specific site
document.getElementById("blockSite").addEventListener("click", async function() {
    try {
        let siteToBlock = document.getElementById("siteToBlock").value;
        if (!siteToBlock) return;
        await blockSite(siteToBlock);
    } catch (error) {
        console.error('Error blocking specific site:', error);
        // Handle error
    }
});

// Initialize the blocked sites list in the options page
updateBlockedSites();
