if (!browser) {
    var browser = chrome;
}

browser.contextMenus.create({
    id: "clear-site-data",
    title: "Clear site data"
});

browser.browserAction.onClicked.addListener(handleBrowserActionRequest);
browser.contextMenus.onClicked.addListener(handleBrowserActionRequest);

function handleContextMenuRequest(info, tab) {
    console.log("Handling context-menu request...", [info, tab]);
    clearSiteData(tab);
}

function handleBrowserActionRequest(tab) {
    console.log("Handling browser-action request...", tab);
    clearSiteData(tab);
}

function clearSiteData(currentTab) {
    console.log("Clearing site data...", currentTab);

    const data = {
        local_storage: true,
        session_storage: true,
        indexed_db: true,
        cookies: true
    };

    browser.tabs.query({currentWindow: true, active: true}).then((tabs => {
        for (let tab of tabs) {
            browser.tabs.sendMessage(tab.id, data);
        }
    }));
    
}
