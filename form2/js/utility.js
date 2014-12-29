function validate_input()
{
	var valideate_url = document.getElementById("url").value;
	var valideate_email = document.getElementById("email").value;
	var valideate_password = document.getElementById("master_password").value;
	var valideate_version = document.getElementById("version").value;
		
  	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;  
	if(valideate_url == "")
  	{
  		document.getElementById("url").focus();
	}
  	else if(valideate_email == "")
	{
  		document.getElementById("email").focus();  		
	}
	else if(valideate_password == "")
	{
	  	document.getElementById("master_password").focus();
	}	
	else if(valideate_version == "")
	{
  		document.getElementById("version").focus();
  	}
  	else if (reg.test(valideate_email) == false) 
 	{
		alert("Enter proper email address");
		document.getElementById("email").focus();
	}	
	else if(isNaN(valideate_version) == true)
  	{
  		alert("Enter integer value for version");
		document.getElementById("version").focus();
  	}
	else
 	{
 	 	//alert("all done");
  		return true;
  	}
  	return false; 
}

function isExtension(input)
{
	var extn = ["com","net","htm","html","edu"]
	for(var i=0;i<extn.length;i++)
	{
		if(extn[i] == input)
		{
			return true;
		}
	}
	return false;
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

function generate_pass() 
{

	if(validate_input() == false )
	{
		return;
	}
	
	var scrypt = scrypt_module_factory();
	
	var link = document.getElementById('url').value;
	var res = link.split(".");
	
	var web_link = res[1]; // gives the website link
	if(web_link == undefined || isExtension(web_link))
	{
		web_link = res[0];
	}
	
	var email = document.getElementById('email').value; // gives the email address
	
	var version = document.getElementById("version").value;
	
	var master_password = document.getElementById('master_password').value; // gives the master password
	
	var salt = web_link+email+version;
	
	var sitepass_length = 12 + ((master_password.length + web_link.length)%4) 
	
	var scrypt_output = scrypt.crypto_scrypt(scrypt.encode_utf8(master_password),
	                 scrypt.encode_utf8(salt),
    	                16384, 8, 1, sitepass_length);
    	                
    var password = form_password(scrypt_output);

	document.getElementById("site_password").value = password;
		
}
	
	
function show_password() 
{
	if (showpass.checked) 
	{
		document.getElementById("site_password").type="text";
	}
   	else
   	{
		document.getElementById("site_password").type="password";
   	}
}
