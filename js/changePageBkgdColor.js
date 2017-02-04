function change_background_color(color) {
	document.getElementsByTagName("body")[0].setAttribute("style","background-color:"+color);
}
// change_background_color("lightgreen");
var base = document.getElementsByTagName("base")[0];
if (base) {
	base.setAttribute("target","_blank");
} else {
	var base=document.createElement("base");
	base.setAttribute("target","_blank");
	document.getElementsByTagName("header")[0].appendChild(base);
}
