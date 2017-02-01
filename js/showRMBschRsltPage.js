function convert2RMB(orig, exchangeRate) {
	return orig*exchangeRate;
}
// input: "$ 123 45" output: "123.45"
function formatOrig(orig) {
	return orig.replace(RegExp("\\D*([0-9]+)\\s+([0-9]+)"), "$1.$2");
}
function showRMB(exchangeRate, style) {
	console.log("showRMB");
	var elements = document.getElementsByClassName("sx-price sx-price-large");
	if (elements && elements.length != 0) {
		var RMB;
		for (var i=0; i < elements.length; ++i) {
			RMB = convert2RMB(formatOrig(data_of(elements[i])),exchangeRate);
			console.log("RMB="+RMB);
			var node = elements[i].cloneNode(true);
			node.setAttribute("style",style);
			node.setAttribute("name","RMB");
			node.getElementsByClassName("sx-price-currency")[0].innerHTML="RMB";
			node.getElementsByClassName("sx-price-whole")[0].innerHTML=RMB.toFixed(0);
			node.removeChild(node.getElementsByClassName("sx-price-fractional")[0]);
			elements[i].appendChild(node);
			++i;
		}
	}
}
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		console.log("recv message "+message.header);
		if(message.header == "exchangeRate"){
			console.log("exchangeRate="+message.exchangeRate);
			showRMB(message.exchangeRate, "color:green;background-color:lightgrey");
		}
	}
);
chrome.runtime.sendMessage({header:"reqExchangeRate"});
console.log("==========================");
