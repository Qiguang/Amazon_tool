function triggerFixSearchBar() {
	setTimeout(fixSearchBar, 1000);
}
function fixSearchBar() {
	switch (getLocationToken()+isProductPg()) {
		case "comfalse":
		case "cafalse":
			document.getElementsByTagName("header")[0].setAttribute("style","position:fixed;top:0px;width:100%;z-index:100");
			document.getElementById("main").setAttribute("style","margin-top:95px");
			document.getElementById("nav-subnav").setAttribute("style","display:none");
		break;
		default:
			document.getElementById("nav-belt").setAttribute("style","position:fixed;top:0px");
			document.getElementById("nav-main").setAttribute("style","position:fixed;top:30px");
			document.getElementById("nav-subnav").setAttribute("style","margin-top:90px");
		break;
	}
	pushMsgHandler("XHReqHappen", triggerFixSearchBar);
}
fixSearchBar();
