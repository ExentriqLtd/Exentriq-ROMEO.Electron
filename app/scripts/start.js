(function() {
    var key = 'rocket.chat.hosts',
        rocketHeader = 'X-Rocket-Chat-Version'.toLowerCase(),
        defaultInstance = 'http://talk.stage.exentriq.com/';

    // Redirect to Exentriq talk: no need for custom servers.
    connectDefaultInstance(defaultInstance);

    // connection check
    if (!navigator.onLine) offline();
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);

    function online() {
        document.body.classList.remove('offline');
    }

    function offline() {
        document.body.classList.add('offline');
    }
    // end connection check

    function getInstanceButtonByURL(url) {
        var list = document.getElementById('serverList');
        for (var i = 0; i < list.childNodes.length; i++) {
            if (list.childNodes[i].dataset.host === url) {
                return list.childNodes[i];
            }
        }
    }

    function connectDefaultInstance(url) {
       document.getElementById('rocketAppFrame').src = url;
    }

    var rocketAppFrame = document.getElementById('rocketAppFrame');
    rocketAppFrame.onload = function () {
        rocketAppFrame.contentWindow.addEventListener('unread-changed', function (e) {
            window.dispatchEvent(new CustomEvent('unread-changed', {
                detail: e.detail
            }));
        });
        rocketAppFrame.contentWindow.document.addEventListener('click', supportExternalLinks, false);
        rocketAppFrame.contentWindow.open = function() {
            return window.open.apply(this, arguments);
        }
    };
})();
