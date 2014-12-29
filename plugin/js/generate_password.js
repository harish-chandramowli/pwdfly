function generate_site_pwd() {
   
  var url = document.getElementById("url").value;
  var url_token = url.split(".");
  
  if(typeof url_token[1] != 'undefined')
  	var url = url_token[0];
  
  if(typeof url_token[2] != 'undefined')
  	var url = url_token[1];
  	  
  var email = document.getElementById("email").value;
  var master_pwd = document.getElementById("master_pwd").value;
  var version = document.getElementById("version").value;
  
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;  
  if(url == "")
  	{
  		document.getElementById("url").focus();
  	}
  	else if(email == "")
  	{
  		document.getElementById("email").focus();
  		
  	}
  	else if(master_pwd == "")
  	{
  		document.getElementById("master_pwd").focus();
  	}
	else if(version == "")
  	{
  		document.getElementById("version").focus();
  	}
  	else if (reg.test(email) == false) 
    {
        document.getElementById("email").focus();
    }
    else
  	{
  		syncvalues(email,version);
  		
  		var scrypt = scrypt_module_factory();
  		var salt = url+email+version;
	
		var sitepass_length = 12 + ((master_pwd.length + url.length)%4);
	
		var scrypt_output = scrypt.crypto_scrypt(scrypt.encode_utf8(master_pwd),
	                 scrypt.encode_utf8(salt),
    	                16384, 8, 1, sitepass_length);
    	                
    	var password = form_password(scrypt_output);
    	
    	document.getElementById('site_pwd').value = password;
	}
}

function syncvalues(email,version)
{
	chrome.storage.sync.set({'email': email}, function (result) {
				});
	chrome.storage.sync.set({'ver': version}, function (result) {
				});

}

function replaceChar(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}


function validate_pass(password)
{
		var lower_alpha = false;
		var upper_alpha = false;
		var number = false;
		var spl_char = false; 
		var temp_pass = ""
		for(var i=0; i<password.length; i++)
		{
			if(password[i] >= "0" && password[i] <= "9")
				number = true;
			else if(password[i] >= "A" && password[i] <= "Z")
				upper_alpha = true;
			else if(password[i] >= "a" && password[i] <= "z")
				lower_alpha = true;
			else
				spl_char = true;
		}
}


function create_strict_password(password)
{
		var number = null;
		var lower_alpha = null;
		var upper_alpha = null;
		var spl_char = null;
		for(var i=0; i<password.length; i++)
		{
			if(password[i] >= "0" && password[i] <= "9")
				number = password[i];
			else if(password[i] >= "A" && password[i] <= "Z")
				upper_alpha = password[i];
			else if(password[i] >= "a" && password[i] <= "z")
				lower_alpha = password[i];
			else
				spl_char = password[i];
		}
		
		//Make sure the password has at-least one lower case character is present
		
		if(lower_alpha == null)
			lower_alpha = String.fromCharCode(97+(password.charCodeAt(0)%26));
			password = temp_pass + password.substr(constrains);
		if(upper_alpha == null)
			upper_alpha = String.fromCharCode(65+(password.charCodeAt(1)%26));
		if(number == null)
			number = String.fromCharCode(48+(password.charCodeAt(2)%10));
		if(spl_char == null)
		{
			var spl_char = ["!","@","#","$","%","^","&","*","(",")","_","-","+","=",",","<",".",">","?","/",";",":","\"","[","{","}","]","|"];
			spl_char = spl_char[password.charCodeAt(3)%spl_char.length];
		}
		return lower_alpha + upper_alpha + number + spl_char + password.substring(4)
}


function form_password(scrypt_output)
{
	var constrains = 4; //Different type of inputs promised
	var spl_char = ["!","@","#","$","%","^","&","*","(",")","_","-","+","=",",","<",".",">","?","/",";",":","\"","[","{","}","]","|"];
	
	var charset_size = 26+26+10+spl_char.length;
	var password = "";//b64_outbut.substring(0, sitepass_length);
	
	for(var i=0;i<scrypt_output.length;i++)
	{
		var rand_index = (scrypt_output[i]*(charset_size-1))/255;
		rand_index = Math.round(rand_index);
		var new_char;
		if(rand_index < 26)
		{
			new_char = String.fromCharCode(97 + rand_index);
		}
		else if(rand_index < 52)
		{
			new_char = String.fromCharCode(65+ rand_index - 26);
		}
		else if(rand_index < 62)
		{
			new_char = String.fromCharCode(48 + rand_index - 52);
		}
		else
		{
			new_char = spl_char[rand_index-62];
		}
		password = password + new_char;
	}
	
	if(validate_pass(password) == false )
	{
		password = create_strict_password(password);
	}
	
	return password;
}


document.getElementById("generate_pwd").onclick = generate_site_pwd;