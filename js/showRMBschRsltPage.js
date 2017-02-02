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
function formatOrig(orig, locationToken) {
	console.log("formatOrig");
	var strings = new Array;
	var matchRegex, replaceRegex;
	var replacePattern;
	switch (locationToken) {
		case "com":
			matchRegex = RegExp("\\D\\s*\\d+\\s+\\d+",'g');
			replaceRegex = RegExp("\\D\\s*(\\d+)\\s+(\\d+)");
			replacePattern = "$1.$2";
		break;
		case "co.jp":
			matchRegex = RegExp("\\D\\s*[0-9,]+",'g');
			replaceRegex = RegExp("\\D?\\s*(\\d+)",'g');
			replacePattern = "$1";
		break;
		case "co.uk":
			matchRegex = RegExp("\\D\\s*([0-9.]+)",'g');
			replaceRegex = RegExp("\\D?\\s*([0-9.]+)",'g');
			replacePattern = "$1";
		break;
		default:
			return strings;
		break;
	}
	strings = orig.match(matchRegex);
	if (strings) {
		for (var i=0; i<strings.length; ++i) {
			strings[i]=strings[i].replace(replaceRegex,replacePattern);
			console.log(strings[i]);
		}
	}
	return strings;
}
var locationToken = null;
function getLocationToken() {
	if (!locationToken) {
		var result = RegExp("amazon\\.((?:\\w+\\.?)+)").exec(location.href);  
		if (result) {
			locationToken = result[1];
		}
	}
	return locationToken;
}
function showRMB(exchangeRate, style) {
	switch (getLocationToken()) {
		case "com":
			showRMBforUS(exchangeRate, style);
		break;
		case "co.jp":
			showRMBforJP(exchangeRate, style);
		break;
		case "co.uk":
			showRMBforUK(exchangeRate, style);
		break;
		default:
		break;
	}

}
function showRMBforUS(exchangeRate, style) {
	console.log("showRMB");
	var elements = document.getElementsByClassName("sx-price sx-price-large");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			var RMBs = convert2RMB(formatOrig(data_of(elements[i]), getLocationToken()),exchangeRate);
			if (!RMBs) continue;
			console.log("RMB="+RMBs);
			var node = elements[i].cloneNode(true);
			node.setAttribute("style",style);
			node.setAttribute("name","RMB");
			var childs = node.getElementsByClassName("sx-price-currency");
			for (var x=0; x<childs.length; ++x) {
				childs[x].innerHTML="¥";
			}
			childs = node.getElementsByClassName("sx-price-whole");
			for (var x=0; x<childs.length; ++x) {
				childs[x].innerHTML=RMBs[x].toFixed(0);
			}
			childs = node.getElementsByClassName("sx-price-fractional");
			for (var x=0; x<childs.length; ++x) {
				node.removeChild(childs[x]);
				--x;
			}
			elements[i].parentNode.appendChild(node);
			++i;
		}
	}
}
function showRMBforJP(exchangeRate, style) {
	console.log("showRMB");
	var elements = document.getElementsByClassName("a-size-base a-text-bold");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			var RMBs = convert2RMB(formatOrig(data_of(elements[i]), getLocationToken()),exchangeRate);
			if (!RMBs) continue;
			console.log("RMB="+RMBs);
			var node = elements[i].cloneNode(true);
			node.setAttribute("style",style);
			node.setAttribute("name","RMB");
			var classValue = node.getAttribute("class");
			classValue = classValue.replace(RegExp(" a-color-price"),"");
			node.setAttribute("class",classValue);
			var RMBsText;
			RMBsText="RMB "+RMBs[0].toFixed(0);
			for (var x=1; x<RMBs.length; ++x) {
				RMBsText+="-RMB "+RMBs[x].toFixed(0);
			}
			node.innerHTML=RMBsText;
			elements[i].appendChild(node);
			++i;
		}
	}
}
function showRMBforUK(exchangeRate, style) {
	console.log("showRMB");
	var elements = document.getElementsByClassName("a-size-base a-text-bold");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			var RMBs = convert2RMB(formatOrig(data_of(elements[i]), getLocationToken()),exchangeRate);
			if (!RMBs) continue;
			console.log("RMB="+RMBs);
			var node = elements[i].cloneNode(true);
			node.setAttribute("style",style);
			node.setAttribute("name","RMB");
			var classValue = node.getAttribute("class");
			classValue = classValue.replace(RegExp(" a-color-price"),"");
			node.setAttribute("class",classValue);
			var RMBsText;
			RMBsText="¥"+RMBs[0].toFixed(0);
			for (var x=1; x<RMBs.length; ++x) {
				RMBsText+=" - ¥"+RMBs[x].toFixed(0);
			}
			node.innerHTML=RMBsText;
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
message = new Object;
message.header = "reqExchangeRate";
message.locationToken = getLocationToken();
chrome.runtime.sendMessage(message);
console.log("==========================");
