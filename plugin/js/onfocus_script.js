function focus_text() {
   
   document.getElementById("site_pwd").focus();
	document.getElementById("site_pwd").select();
}
document.getElementById("site_pwd").onclick = focus_text;