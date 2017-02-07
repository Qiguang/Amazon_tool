chrome.webRequest.onCompleted.addListener(
	function(details) {
		console.log("+++++++++++++++");
		console.log(details.type);
		console.log(details.url);
		if (idOfTabs.indexOf(details.tabId)!=-1 && details.type=="xmlhttprequest") {
			chrome.tabs.sendMessage(details.tabId,{header:"XHReqHappen"});
		}
	},
	{urls:["*://www.amazon.com/*","*://www.amazon.co.jp/*","*://www.amazon.co.uk/*","*://www.amazon.de/*"]}
);
var idOfTabs = new Array();
chrome.tabs.onRemoved.addListener(function(tabId){rmFrListeners(tabId);});
function add2Listeners(tabId) {
	if (idOfTabs.indexOf(tabId) == -1)
		idOfTabs.push(tabId);
}
function rmFrListeners(tabId) {
	var index = idOfTabs.indexOf(tabId);
	if (index != -1) {
		idOfTabs.splice(index, 1);
	}
}
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		switch (message.header) {
			case "listenXHRequest":
				console.log("recv message "+message.header);
				add2Listeners(sender.tab.id);
			break;
			case "deListenXHRequest":
				console.log("recv message "+message.header);
				rmFrListeners(sender.tab.id);
			break;
		}
	}
);
