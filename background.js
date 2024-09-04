chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf('store.steampowered.com') > -1) {
        chrome.pageAction.show(tabId);
    }
});

chrome.extension.onRequest.addListener(function(request, sender, callback) {

    if (request.setDisplayedVersion) {
        localStorage.setItem('displayedVersion', request.setDisplayedVersion);
        chrome.tabs.reload();
    }
    
    if (request.getDisplayedVersion) {
        var displayedVersion = localStorage.getItem('displayedVersion') || 'euro_czk';
        callback(displayedVersion);
    }
    
});