/* globals $ */

import { remote, ipcRenderer } from 'electron';
// import { servers } from './servers';
// import { sidebar } from './sidebar';
import { webview } from './webview';
import tray from './tray';
import './menus';

export var setBadge = function (badge) {
    if (process.platform === 'darwin') {
        remote.app.dock.setBadge(badge.toString());
    }
    tray.showTrayAlert(!isNaN(parseInt(badge)) && badge > 0, badge.toString());
};


export var start = function() {
    var defaultInstance = 'https://talk.exentriq.com';
    console.log('adding', defaultInstance);
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
