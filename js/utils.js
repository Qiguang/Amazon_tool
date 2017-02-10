function data_of( txt )
{
  var data = txt.textContent;
  // Use ECMA-262 Edition 3 String and RegExp features
  data = data.replace(/[\t\n\r ]+/g, " ");
  if (data.charAt(0) == " ")
    data = data.substring(1, data.length);
  if (data.charAt(data.length - 1) == " ")
    data = data.substring(0, data.length - 1);
  return data;
}
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
	xmlHttp.onerror = function(){
		console.log("get exchangeRate fail from "+theUrl);
	}
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
function isProductPg() {
	if (RegExp("amazon\\.[a-z.]+/[^/]+/dp").exec(location.href)) {
		return true;
	}
	return false;
}
function isNumber(num) {
	return !isNaN(num);
}
var msgHandlerMap = new Array();
function pushMsgHandler(msgName, handler) {
	if (!msgHandlerMap[msgName]) {
		msgHandlerMap[msgName] = new Array();
	}
	msgHandlerMap[msgName].push(handler);
}
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse){
		if (msgHandlerMap[message.header] && msgHandlerMap[message.header].length) {
			var qLen = msgHandlerMap[message.header].length;
			while (qLen--) {
				var func = msgHandlerMap[message.header].shift();
				console.log("call--->"+func.name);
				func(message);
			}
		}
	}
);
