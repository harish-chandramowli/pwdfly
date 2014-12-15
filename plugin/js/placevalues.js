function place_values() {

   chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url;
    var tab = tablink.split(".");
    
    
    document.getElementById("url").value = tab[1];
	
});
		var email_val = document.getElementById("email").value;
	
		if(email_val != "")
		{
			chrome.storage.sync.set({'email': email_val}, function (result) {
				});
	
		}
		
		chrome.storage.sync.get('email', function (result) {
        var sync_email = result.email;
		document.getElementById("email").value = sync_email;
		});
       
		var version = document.getElementById("version").value;
		
		if(version != "")
		{
			chrome.storage.sync.set({'ver': version}, function (result) {
				});
	
		}
		
		chrome.storage.sync.get('ver', function (result) {
        var sync_version = result.ver;
		document.getElementById("version").value = sync_version;
		});	

}
document.getElementById("place_values").onclick = place_values;


