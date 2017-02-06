var exchangeRate = new Array;

function getExRateFrNet(regionToken, callback) { // get exchange rate from internet
	if (exchangeRate[regionToken]) {
		callback(exchangeRate[regionToken]);
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
			regex = RegExp("1\\s*日元[^0-9]*([0-9.]+)\\s*人民币");
		break;
		case "co.uk":
			regex = RegExp("1\\s*英镑[^0-9]*([0-9.]+)\\s*人民币");
		break;
		case "de":
			regex = RegExp("1\\s*欧元[^0-9]*([0-9.]+)\\s*人民币");
		break;
		default:
		break;
	}
	httpGetAsync(exchangeRateSource ,
		function(response){
			result = regex.exec(response);
			if(result){
				exchangeRate[regionToken] = result[1];
				callback(exchangeRate[regionToken]);
			}else{
				console.log("html parse failed. source page format may changed")
			}
		});
}
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		switch (message.header) {
			case "reqExchangeRate":
				console.log("recv message "+message.header);
				console.log("location "+message.locationToken);
				getExRateFrNet(message.locationToken, function(exchangeRate){
					chrome.tabs.sendMessage(sender.tab.id,
						{header:"exchangeRate",exchangeRate:exchangeRate});
				});
			break;
		}
	}
);
