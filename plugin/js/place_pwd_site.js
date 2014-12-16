function place_pwd_site() {

	var x = document.getElementById("site_pwd").value;

	if(x == "")
	{
		document.getElementById("site_pwd").focus();
	}
	else
	{
	//chrome.tabs.executeScript(null, {code:"var x = '"+x+"'; try{document.getElementById('pass').value = x;}catch(e){alert(e);}"},null);
		chrome.tabs.executeScript(null, {code:"var x = '"+x+"'; try{var inputs=document.getElementsByTagName('input');var length = inputs.length;for(i=0;i<length;i++){if(inputs[i].type == 'password'){var id = inputs[i].id;if(id!=''){document.getElementById(id).value = x;}}}}catch(e){alert(e);}"},null);
	}
}
document.getElementById("place_pwd").onclick = place_pwd_site;
