function generate_site_pwd() {
   
  var url = document.getElementById("url").value;
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
  		var scrypt = scrypt_module_factory();
  		var salt = url+email;
	
		var sitepass_length = 12 + ((master_pwd.length + url.length)%4) 
	
		var spl_char_len = 1 + ((master_pwd.length + email.length)%4)
	
		var scrypt_output = scrypt.crypto_scrypt(scrypt.encode_utf8(master_pwd,
	                 scrypt.encode_utf8(salt),
    	                16384, 8, version, sitepass_length+(2*spl_char_len));
    	                
    	var password = form_password(scrypt_output, sitepass_length, spl_char_len);
	}
  	
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



document.getElementById("generate_pwd").onclick = generate_site_pwd;