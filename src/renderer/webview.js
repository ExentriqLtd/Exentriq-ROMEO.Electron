import { EventEmitter } from 'events';
import { setBadge } from './setBadge.js';
import path from 'path';
class WebView extends EventEmitter {
	constructor() {
		super();
		this.webviewParentElement = document.body;
	}

	add(host) {
		var webviewObj = this.getByUrl(host.url);
		if (webviewObj) {
			return;
		}

		webviewObj = document.createElement('webview');
		webviewObj.setAttribute('server', host.url);
		webviewObj.setAttribute('preload', `file://${path.resolve(__static, 'preload.js')}`);
		webviewObj.setAttribute('allowpopups', 'false');
		webviewObj.setAttribute('disablewebsecurity', 'on');

		webviewObj.addEventListener('console-message', function(e) {
			console.log('webview:', e.message);
		});

		webviewObj.addEventListener('ipc-message', (event) => {
			this.emit('ipc-message-'+event.channel, host.url, event.args);

			switch (event.channel) {
				case 'title-changed':
					document.title = event.args[0];
					break;
				case 'unread-changed':
					setBadge(event.args[0]);
					break;
			}
		});

		webviewObj.addEventListener('dom-ready', () => {
			this.emit('dom-ready', host.url);
		});

		this.webviewParentElement.appendChild(webviewObj);

		webviewObj.src = host.lastPath || host.url;
	}

	remove(hostUrl) {
		var el = this.getByUrl(hostUrl);
		if (el) {
			el.remove();
		}
	}

	getByUrl(hostUrl) {
		return this.webviewParentElement.querySelector(`webview[server="${hostUrl}"]`);
	}

	getActive() {
		return document.querySelector('webview.active');
	}

	isActive(hostUrl) {
		return !!this.webviewParentElement.querySelector(`webview.active[server="${hostUrl}"]`);
	}

	deactiveAll() {
		var item;
		while (!(item = this.getActive()) === false) {
			item.classList.remove('active');
		}
	}

	setActive(hostUrl) {
		console.log('active setted', hostUrl);
		if (this.isActive(hostUrl)) {
			return;
		}

		this.deactiveAll();
		var item = this.getByUrl(hostUrl);
		if (item) {
			item.classList.add('active');
		}

		this.focusActive();
	}

	focusActive() {
		var active = this.getActive();
		if (active) {
			active.focus();
			return true;
		}
		return false;
	}
}

export var webview = new WebView();
