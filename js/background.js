chrome.webRequest.onCompleted.addListener(
        function(details) {
			console.log("===+++++====");
			console.log(details.type);
			if (tabsId.indexOf(details.tabId)!=-1 && details.type=="xmlhttprequest") {
				console.log(details.url);
				console.log(details.type);
				console.log(details.tabId);
				chrome.tabs.sendMessage(details.tabId,{header:"XHReqHappen"});
			}
        },
		{urls:["*://www.amazon.com/*","*://www.amazon.co.jp/*","*://www.amazon.co.uk/*"]}
);
var tabsId = new Array();
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		switch (message.header) {
			case "listenXHRequest":
				console.log("recv message "+message.header);
				if (tabsId.indexOf(sender.tab.id) == -1)
					tabsId.push(sender.tab.id);
			break;
		}
	}
);
