/* globals $ */

import { remote } from 'electron';
import { webview } from './webview';
import './menus';

export var start = function() {
    var defaultInstance = 'https://talk.exentriq.com';
    webview.add({url:defaultInstance});
    webview.setActive(defaultInstance);
    webview.focusActive();
    // connection check
    function online() {
        document.body.classList.remove('offline');
    }

    function offline() {
        document.body.classList.add('offline');
    }

    if (!navigator.onLine) {
        offline();
    }
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
};

window.addEventListener('focus', function() {
    webview.focusActive();
});
