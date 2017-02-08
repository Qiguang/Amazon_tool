switch (getLocationToken()) {
	case "com":
		document.getElementsByTagName("header")[0].setAttribute("style","position:fixed;top:0px;width:100%;z-index:100");
		document.getElementById("main").setAttribute("style","margin-top:95px");
	break;
	default:
		document.getElementById("nav-belt").setAttribute("style","position:fixed;top:0px");
		document.getElementById("nav-main").setAttribute("style","position:fixed;top:30px");
		document.getElementById("nav-subnav").setAttribute("style","margin-top:90px");
	break;
}
