function onMessage(request, sender, sendResponse) {
    console.log("On message", [request, sender]);

    clearSiteData(request).then(
        r => sendResponse({response: r}),
        e => sendResponse({error: e}),
    );
}

function clearSiteData(options) {
    const promises = [];

    options = options || {};

    if (options.local_storage && window.localStorage) {
        window.localStorage.clear();
        promises.push(Promise.resolve());
    }

    if (options.session_storage && window.sessionStorage) {
        window.sessionStorage.clear();
        promises.push(Promise.resolve());
    }

    if (options.indexed_db && window.indexedDB) {
        promises.push(clearIndexedDB());
    }

    if (options.cookies) {
        clearCookies();
        promises.push(Promise.resolve());
    }

    return Promise.all(promises);
}

function clearIndexedDB() {

    if (!window.indexedDB.databases) {
        console.error("'indexedDB.databases()' not supported.");
        return Promise.reject();
    }

    // todo: close databases?

    // clear all databases
    return window.indexedDB.databases().then(
        databases => {
            return databases.map(db => promisifyRequest(window.indexedDB.deleteDatabase(db.name)));
        }
    )
}

function promisifyRequest(request) {
    return new Promise(function (resolve, reject) {
        request.onsuccess = resolve;
        request.onerror = reject;
    });
}

function clearCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

chrome.runtime.onMessage.addListener(onMessage);