function clearIndexedDB() {

    if (!window.indexedDB.databases) {
        console.error("'indexedDB.databases()' not supported.");
        return Promise.reject();
    }

    // clear all databases
    return window.indexedDB.databases().then(
        databases => {
            return databases.map(db => deleteDatabase(db.name));
        }
    )
}

function deleteDatabase(name) {
    return promisifyRequest(window.indexedDB.deleteDatabase(db.name)).then(() => );
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

function clearSiteData(options) {
    const promises = [];

    options = options || {};

    if (options.local_storage && window.localStorage) {
        console.log("Clearing localStorage...");
        window.localStorage.clear();
        promises.push(Promise.resolve());
    }

    if (options.session_storage && window.sessionStorage) {
        console.log("Clearing sessionStorage...");
        window.sessionStorage.clear();
        promises.push(Promise.resolve());
    }

    if (options.indexed_db && window.indexedDB) {
        console.log("Clearing indexedDB...");
        promises.push(clearIndexedDB());
    }

    if (options.cookies) {
        console.log("Clearing cookies...");
        clearCookies();
        promises.push(Promise.resolve());
    }

    console.log("Clearing site data...", promises);
    return Promise.all(promises);
}

chrome.runtime.onMessage.addListener(function (request, sender) {
    console.log("On message", [request, sender]);
    return clearSiteData(request);
});