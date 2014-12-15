function change_type() {
if (check.checked) {
   document.getElementById("site_pwd").type="text";
   }
   else
   {
   document.getElementById("site_pwd").type="password";
   }
}
document.getElementById("check").onchange = change_type;