function convert2RMB(orig, exchangeRate) {
	console.log("convert2RMB");
	var nums = new Array;
	if (orig) {
		for (var i=0; i< orig.length; ++i) {
			nums[i] = Number(orig[i]*exchangeRate);
			console.log(nums[i]);
		}
	}
	return nums;
}
// input: "$ 123 45" output: "123.45"
function formatOrig(orig) {
	console.log("formatOrig");
	var strings = new Array;
	strings = orig.match(RegExp("\\D*[0-9]+\\s+[0-9]+",'g'));
	if (strings) {
		for (var i=0; i<strings.length; ++i) {
			strings[i]=strings[i].replace(RegExp("\\D*([0-9]+)\\s+([0-9]+)"), "$1.$2");
			console.log(strings[i]);
		}
	}
	return strings;
}
function showRMB(exchangeRate, style) {
	console.log("showRMB");
	var elements = document.getElementsByClassName("sx-price sx-price-large");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			var RMB = convert2RMB(formatOrig(data_of(elements[i])),exchangeRate);
			if (!RMB) continue;
			console.log("RMB="+RMB);
			var node = elements[i].cloneNode(true);
			node.setAttribute("style",style);
			node.setAttribute("name","RMB");
			var childs = node.getElementsByClassName("sx-price-currency");
			for (var x=0; x<childs.length; ++x) {
				childs[x].innerHTML="RMB";
			}
			childs = node.getElementsByClassName("sx-price-whole");
			for (var x=0; x<childs.length; ++x) {
				childs[x].innerHTML=RMB[x].toFixed(0);
			}
			childs = node.getElementsByClassName("sx-price-fractional");
			for (var x=0; x<childs.length; ++x) {
				node.removeChild(childs[x]);
				--x;
			}
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
