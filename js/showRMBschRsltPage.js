function convert2RMB(orig, exchangeRate) {
	var nums = new Array;
	if (orig) {
		for (var i=0; i< orig.length; ++i) {
			nums[i] = Number(orig[i]*exchangeRate);
			console.log(orig[i]+"->"+nums[i].toFixed(0));
		}
	}
	return nums;
}
// input: "$ 123 45" output: "123.45"
function formatOrig(orig, locationToken) {
	var strings = new Array;
	var matchRegex, replaceRegex;
	var replacePattern;
	// remove comma
	orig = orig.replace(RegExp(",",'g'),'');
	switch (locationToken) {
		case "com":
			matchRegex = RegExp("\\d+\\s+\\d+",'g');
			replaceRegex = RegExp("(\\d+)\\s+(\\d+)");
			replacePattern = "$1.$2";
		break;
		case "co.jp":
			matchRegex = RegExp("\\d+",'g');
		break;
		case "co.uk":
			matchRegex = RegExp("([0-9.]+)",'g');
		break;
		case "de":
			matchRegex = RegExp("[0-9]+",'g');
			replaceRegex = RegExp("(.*)(\\d\\d)",'g');
			replacePattern = "$1.$2";
		break;
		default:
			return strings;
		break;
	}
	strings = orig.match(matchRegex);
	if (strings) {
		for (var i=0; i<strings.length; ++i) {
			strings[i]=strings[i].replace(replaceRegex,replacePattern);
		}
	} else {
		strings = new Array;
		strings[0] = '0';
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
	console.log("showRMB");
	switch (getLocationToken()) {
		case "com":
			showRMBforUS(exchangeRate, style);
		break;
		case "co.jp":
			showRMBforJP(exchangeRate, style);
		break;
		case "co.uk":
		case "de":
			 showRMBforUkDe(exchangeRate, style);
		break;
		default:
		break;
	}
	document.getElementById(resultsListTagId).setAttribute("token","RMBshown");
	listenXmlHttpRequest();
	console.log("showRMB-end");
}
function showRMBforUS(exchangeRate, style) {
	var elements = document.getElementsByClassName("sx-price sx-price-large");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			if (elements[i].getAttribute("token")) {
				continue;
			}
			if (i+1 < elements.length && elements[i+1].getAttribute("token")) {
				continue;
			}
			var RMBs = convert2RMB(formatOrig(data_of(elements[i]), getLocationToken()),exchangeRate);
			if (!RMBs) continue;
			var node = elements[i].cloneNode(true);
			node.setAttribute("style",style);
			node.setAttribute("token","RMB");
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
	} else {
		console.log("get"+"sx-price sx-price-large"+"failed");
	}
}
function showRMBforJP(exchangeRate, style) {
	var elements = document.getElementsByClassName("a-size-base a-text-bold");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			if (elements[i].getAttribute("token")) {
				continue;
			}
			if (i+1 < elements.length && elements[i+1].getAttribute("token")) {
				continue;
			}
			var RMBs = convert2RMB(formatOrig(data_of(elements[i]), getLocationToken()),exchangeRate);
			if (!RMBs) continue;
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
function showRMBforUkDe(exchangeRate, style) {
	var elements = document.getElementsByClassName("a-size-base a-text-bold");
	if (elements && elements.length != 0) {
		for (var i=0; i < elements.length; ++i) {
			if (elements[i].getAttribute("token")) {
				continue;
			}
			if (i+1 < elements.length && elements[i+1].getAttribute("token")) {
				continue;
			}
			var RMBs = convert2RMB(formatOrig(data_of(elements[i]), getLocationToken()),exchangeRate);
			if (!RMBs) continue;
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
var resultsListTagId = "s-results-list-atf";
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		switch (message.header) {
			case "exchangeRate":
				console.log("exchangeRate="+message.exchangeRate);
				showRMB(message.exchangeRate, "color:green;background-color:lightgrey");
			break;
			case "XHReqHappen":
				console.log("XHReqHappen+++");
				deListenXmlHttpRequest();
				toggleShowRMB(2000);
			break;
		}
	}
);
function eligibleShowRMB() {
	var token = document.getElementById(resultsListTagId).getAttribute("token");
	if (!token || token != "RMBshown") {
		console.log("no RMB token");
		return true;
	}
	return false;
}
function toggleShowRMB(time) {
	setTimeout(function(){
		message = new Object;
		message.header = "reqExchangeRate";
		message.locationToken = getLocationToken();
		chrome.runtime.sendMessage(message);
	}, time);// wait for browser show data complete
}
function listenXmlHttpRequest() {
	message = new Object;
	message.header = "listenXHRequest";
	chrome.runtime.sendMessage(message);
}
function deListenXmlHttpRequest() {
	message = new Object;
	message.header = "deListenXHRequest";
	chrome.runtime.sendMessage(message);
}
console.log("==========================");
toggleShowRMB(500);
