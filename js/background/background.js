chrome.webRequest.onCompleted.addListener(
	function(details) {
		console.log("+++++++++++++++");
		console.log(details.type);
		console.log(details.url);
		if (details.type=="xmlhttprequest") {
			chrome.tabs.sendMessage(details.tabId,{header:"XHReqHappen"});
		}
	},
	{urls:["*://www.amazon.com/*",
			"*://www.amazon.co.jp/*",
			"*://www.amazon.co.uk/*",
			"*://www.amazon.de/*",
			"*://www.amazon.ca/*"]}
);
