/*
 * Elasticsearch CSV Exporter
 * v0.1
 * https://github.com/minewhat/es-csv-exporter
 * MIT licensed
 *
 * Copyright (c) 2014-2015 MineWhat,Inc
 *
 * Credits: This extension is created using Extensionizr , github.com/uzairfarooq/arrive
 */

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.msg == "store-csv") {
            var csvContents = request.data;
            // var input = document.createElement('textarea');
            // document.body.appendChild(input);
            // input.value = csvContents;
            // input.focus();

            // //Select all content
            // document.execCommand('SelectAll');
            // //Copy Content
            // document.execCommand("Copy", false, null);
            // input.remove();

            download_csv(csvContents);

            sendResponse({
                status: "success"
            });
        } else if (request.msg == "badge") {
            badgeOnOff(request.data);
        } else {
            sendResponse({
                status: "Unknown Message"
            });
        }
    }
);




function download_csv(data) {

    var csv = '';
    data.forEach(function(row) {
        csv += row.join(',');
        csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.setAttribute("id", "tmp-dashboard-data");
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'dashboard-data.csv';
    hiddenElement.click();
    delete document.getElementById("tmp-dashboard-data");
    // window.open('data:text/csv;charset=utf-8,' + encodeURI(csv));

}

function badgeOnOff(on) {
    if (on) {
        chrome.browserAction.setBadgeText({
            text: 'ON'
        });
    } else {
        chrome.browserAction.setBadgeText({
            text: ''
        });
    }
}
chrome.browserAction.setBadgeBackgroundColor({
    color: '#d57d00'
});
chrome.browserAction.setBadgeText({
    text: ''
});


//On tab selection change
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    chrome.tabs.getSelected(null, function(tab) {
        if (tab && tab.url && tab.url.indexOf("app/kibana") >= 0) {
            badgeOnOff(true);
        } else {
            badgeOnOff(false);
        }
    });
});