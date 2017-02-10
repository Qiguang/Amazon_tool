function refreshPageBar() {
	console.log("refreshPageBar");
	togglePageBarRefactor(2000);
}
function togglePageBarRefactor(time) {
	setTimeout(function() {
		fixPagesBar();
		addInput2Bar();
		pushMsgHandler("XHReqHappen",refreshPageBar);
	}, time);
}
togglePageBarRefactor(500);
function addInput2Bar() {
	if (document.getElementById("numInput")) return;
	var node = document.getElementById("centerBelowMinus");
	if (!node) return;
	var pagnRA = node.getElementsByClassName("pagnRA")[0];
	if (!pagnRA) {
		console.log("no pagnRA");
		pagnRA = node.getElementsByClassName("pagnRA1")[0];
	}
	if (!pagnRA) {
		console.log("no pagnRA1");
		return;
	}
	var input = document.createElement("input");
	input.setAttribute("type","input");
	input.setAttribute("id","numInput");
	input.setAttribute("style","width:40px;vertical-align:initial;");
	input.addEventListener("keyup", function(){enterPress(event, gotoPageByNum);});
	pagnRA.parentNode.insertBefore(input, pagnRA);
}
function fixPagesBar(){
	var node = document.getElementById("centerBelowMinus");
	if (node && !node.getAttribute("token")) {
		node.setAttribute("style","position:fixed;bottom:5%;z-index:100;cursor:move;right:5%;");
		node.setAttribute("token","fixed");
	}
}
function enterPress(e, callback){
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13) { //Enter keycode
		callback();
	}
}
function gotoPageByNum() {
	console.log("gotoPageByNum");
	var input = document.getElementById("numInput");
	var pageNum = input.value;
	if (isNumber(pageNum) && pageNum >= 1) {
		var node = document.getElementById("centerBelowMinus");
		if (!node) {console.log("return1");return;}
		node = node.getElementsByTagName("input")[0];
		if (!node) {console.log("return5");return;}
		var maxNumNode = node.previousElementSibling;
		if (!maxNumNode) {console.log("return2");return;}
		var maxNum = maxNumNode.innerText;
		if (!isNumber(maxNum)) {console.log("return3");return;}
		if (pageNum > parseInt(maxNum)) {console.log("return4");return;}
		if (location.href.match("page=")) {
			location.href = location.href.replace(RegExp("(page=)\\d+"),"$1"+pageNum);
		} else {
			location.href = location.href + "&page=" + pageNum;
		}
	}
}
