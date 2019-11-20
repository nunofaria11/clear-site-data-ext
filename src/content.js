(function (window, browser) {

    function onMessage(data, sender) {
        console.log("On message", [data, sender]);
        return clearSiteData(data || {});
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
        // clear all databases
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

    browser.runtime.onMessage.addListener(onMessage);
})(window, browser || chrome);