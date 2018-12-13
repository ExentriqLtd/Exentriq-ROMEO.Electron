/* globals $ */
import { remote } from 'electron';
import tray from './tray';

export var setBadge = function (badge) {
    if (process.platform === 'darwin') {
        remote.app.dock.setBadge(badge.toString());
    }
    tray.showTrayAlert(!isNaN(parseInt(badge)) && badge > 0, badge.toString());
};
