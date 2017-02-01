var exchangeRate = null;

function getExRateFrNet(regionToken, callback) { // get exchange rate from internet
	if (exchangeRate) {
		callback(exchangeRate);
		return;
	}
	var result = null;
	var regex;
	var exchangeRateSource = "http://hl.anseo.cn/";
	switch (regionToken) {
		case "com":
			regex = RegExp("1\\s*美元[^0-9]*([0-9.]+)\\s*人民币");
		break;
		case "co.jp":
		break;
		default:
		break;
	}
	httpGetAsync(exchangeRateSource ,
		function(response){
			result = regex.exec(response);
			if(result){
				exchangeRate = result[1];
				callback(exchangeRate);
			}else{
				console.log("html parse failed. source page format may changed")
			}
		});
}
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		console.log("recv message "+message.header);
		if(message.header == "reqExchangeRate"){
			getExRateFrNet("com", function(exchangeRate){
				chrome.tabs.sendMessage(sender.tab.id,
					{header:"exchangeRate",exchangeRate:exchangeRate});
			});
		}
	}
);
