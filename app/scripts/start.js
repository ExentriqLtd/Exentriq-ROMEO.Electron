/* globals $ */

import { remote, ipcRenderer } from 'electron';
// import { servers } from './servers';
// import { sidebar } from './sidebar';
import { webview } from './webview';
import tray from './tray';
import './menus';
import installExtension from 'electron-devtools-installer';

export var setBadge = function (badge) {
    if (process.platform === 'darwin') {
        remote.app.dock.setBadge(badge.toString());
    }
    tray.showTrayAlert(!isNaN(parseInt(badge)) && badge > 0, badge.toString());
};


export var start = function() {
    installExtension('mkaenpdiljjlapjnnnkdihfmmdpheddo')
      .then(function (name) {
          console.log('Added Extension:  '+ name)
      })
      .catch(function (err) {
          console.log('An error occurred: ', err)
      });
    var defaultInstance = 'https://talk-stage.exentriq.com';
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
