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

function temp_fill()
{
	if(document.getElementById("url").value == "")
	{
		document.getElementById("url").value = "we2";
	}
	if(document.getElementById("email").value == "")
	{
		document.getElementById("email").value = "we@we.com";
	}
	if(document.getElementById("master_password").value == "")
	{
		document.getElementById("master_password").value = "Harish@6";
	}
	document.getElementById("version").value = 1;
	document.getElementById("site_password").type="text";
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

function insert_spl(scrypt_output,password,spl_char_len)
{
	var spl_char = ["!","@","#","$","%","^","&","*","(",")","_","-"];

	for(var i=0; i<spl_char_len; i++)
	{
		var spl_insert_id = password.length - spl_char_len+i;
		var spl_rand = scrypt_output[spl_insert_id]%spl_char.length;
		spl_to_insert = spl_char[spl_rand];
		password = replaceChar(password,spl_insert_id,spl_to_insert);
		
		var swap_id = (scrypt_output[password.length + i])%password.length;
		var temp = password[swap_id];
		password = replaceChar(password,swap_id,spl_to_insert);
		password = replaceChar(password,spl_insert_id, temp)
	}
	return password;
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
			lower_alpha = String.fromCharCode("a"+(password[0]%26));
			password = temp_pass + password.substr(constrains);
		if(upper_alpha == null)
			upper_alpha = String.fromCharCode("A"+(password[1]%26));
		if(number == null)
			number = String.fromCharCode("0"+(password[2]%10));
		return lower_alpha + upper_alpha + number + spl_char + password.substring(4)
}


function form_password(scrypt_output, sitepass_length, insert_len)
{
	var constrains = 4; //Different type of inputs promised 
	var b64_outbut = btoa(scrypt_output);
	var password = b64_outbut.substring(0, sitepass_length);
	
	password = insert_spl(scrypt_output,password,insert_len);
	
	if(validate_pass(password) == false )
	{
		password = create_strict_password(password);
	}
	
	return password;
}

function generate_pass() 
{

	temp_fill();
	
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
	
	var salt = web_link+email;
	
	var sitepass_length = 12 + ((master_password.length + web_link.length)%4) 
	
	var spl_char_len = 1 + ((master_password.length + email.length)%4)
	
	var scrypt_output = scrypt.crypto_scrypt(scrypt.encode_utf8(master_password),
	                 scrypt.encode_utf8(salt),
    	                16384, 8, version, sitepass_length+(2*spl_char_len));
    	                
    var password = form_password(scrypt_output, sitepass_length, spl_char_len);

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
