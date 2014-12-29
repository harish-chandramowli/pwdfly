function place_values() {

   chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url;
    var tab = tablink.split(".");
    var flag = 0;
    
    if(tab[1] != undefined && tab[1].indexOf("com") != 0)
        document.getElementById("url").value = tab[1];
    else
    	document.getElementById("url").value = tab[0].replace("https://", "");
	
});
		chrome.storage.sync.get('email', function (result) {
        var sync_email = result.email;
        if(sync_email != undefined)
			document.getElementById("email").value = sync_email;
		});
       	
		chrome.storage.sync.get('ver', function (result) {
        var sync_version = result.ver;
        if(sync_version != undefined)
		document.getElementById("version").value = sync_version;
		});	

}
document.getElementById("body_elem").onload = place_values;


