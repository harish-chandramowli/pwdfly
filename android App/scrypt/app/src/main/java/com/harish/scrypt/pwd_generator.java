package com.harish.scrypt;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;

import com.lambdaworks.crypto.SCryptUtil;
import com.lambdaworks.crypto.SCrypt;


public class pwd_generator extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pwd_generator);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_pwd_generator, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public static boolean validate_pass(String password)
    {
        boolean lower_alpha = false;
        boolean upper_alpha = false;
        boolean number = false;
        boolean spl_char = false;
        for(int i=0; i<password.length(); i++)
        {
            if(password.charAt(i) >= '0' && password.charAt(i) <= '9')
                number = true;
            else if(password.charAt(i) >= 'A' && password.charAt(i) <= 'Z')
                upper_alpha = true;
            else if(password.charAt(i) >= 'a' && password.charAt(i) <= 'z')
                lower_alpha = true;
            else
                spl_char = true;
        }
        return lower_alpha && upper_alpha && number && spl_char;
    }

    public static StringBuilder create_strict_password(String password)
    {
        char number = '\0';
        char lower_alpha = '\0';
        char upper_alpha = '\0';
        char spl_char = '\0';
        for(int i=0; i<password.length(); i++)
        {
            if(password.charAt(i) >= '0' && password.charAt(i) <= '9')
                number = password.charAt(i);
            else if(password.charAt(i) >= 'A' && password.charAt(i) <= 'Z')
                upper_alpha = password.charAt(i);
            else if(password.charAt(i) >= 'a' && password.charAt(i) <= 'z')
                lower_alpha = password.charAt(i);
            else
                spl_char = password.charAt(i);
        }

        //Make sure the password has at-least one lower case character is present
        StringBuilder temp_pass = new StringBuilder();

        if(lower_alpha == '\0')
            lower_alpha = (char)(97+(password.codePointAt(0)%26));
        if(upper_alpha == '\0')
            upper_alpha = (char)(65+(password.codePointAt(1)%26));
        if(number == '\0')
            number = (char)(48+(password.codePointAt(2)%10));
        if(spl_char == '\0')
        {
            char splchar[] = {'!','@','#','$','%','^','&','*','(',')','_','-','+','=',',','<','.','>','?','/',';',':','"','[','{','}',']','|'};
            spl_char = splchar[password.codePointAt(3)%splchar.length];
        }
        temp_pass = temp_pass.append(lower_alpha);
        temp_pass = temp_pass.append(upper_alpha);
        temp_pass = temp_pass.append(number);
        temp_pass = temp_pass.append(spl_char);
        temp_pass = temp_pass.append(password.substring(4));

        return  temp_pass;
    }

    public static String form_password(byte[] scrypt_output)
    {
        StringBuilder password = new StringBuilder();

        int constrains = 4; //Different type of inputs promised
        char spl_char[] = {'!','@','#','$','%','^','&','*','(',')','_','-','+','=',',','<','.','>','?','/',';',':','"','[','{','}',']','|'};

        int charset_size = 26+26+10+spl_char.length;

        for(int i=0;i<scrypt_output.length;i++)
        {
            double f_rand_index = ((scrypt_output[i]&0xFF)*(charset_size-1))/255.0;
            int rand_index = Math.round((float)f_rand_index);
            char new_char;
            if(rand_index < 26)
            {
                new_char = (char) (97 + rand_index);
            }
            else if(rand_index < 52)
            {
                new_char = (char) (65+ rand_index - 26);
            }
            else if(rand_index < 62)
            {
                new_char = (char) (48 + rand_index - 52);
            }
            else
            {
                new_char = spl_char[(int)rand_index-62];
            }
            password = password.append(new_char);
        }

        if(validate_pass(password.toString()) == false )
        {
            password = create_strict_password(password.toString());
        }

        return password.toString();
    }

    public void Generate_Password(View v) throws Exception
    {
        EditText m_pwd = (EditText) findViewById(R.id.passwd);
        EditText url = (EditText) findViewById(R.id.URL);
        EditText version = (EditText) findViewById(R.id.version);
        EditText email = (EditText) findViewById(R.id.email);
        EditText s_pwd = (EditText) findViewById(R.id.site_password);

        StringBuilder salt = new StringBuilder();

        salt.append(url.getText().toString());
        salt.append(email.getText().toString());
        salt.append(version.getText().toString());

        String pwd = m_pwd.getText().toString();

        int sitepass_length = 12 + ((m_pwd.length() + url.length())%4);

        byte[] scrypt_output = SCrypt.scrypt(pwd.getBytes("UTF-8"), salt.toString().getBytes("UTF-8"), 16384, 8, 1, sitepass_length);

        String password = form_password(scrypt_output);
        //String out = SCryptUtil.scrypt(m_pwd.getText().toString(),16384,1,1);
        s_pwd.setText(password);
        return;
    }
}
