document.getElementById("submit-btn-registration").onclick = validate;


function validate() {
    // password validation
    var pass = document.getElementById('password').value;
    var minNumberofChars = 8;
    var maxNumberofChars = 15;
    var regularExpression  = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/;
    console.log(pass); 
    if(pass.length < minNumberofChars || pass.length > maxNumberofChars){
        return false;
    }
    if(!regularExpression.test(pass)) {
        console.log("password should contain atleast one number and one special character");
        return false;
    }

    if(!document.form.cpassword.value !=document.form.pass.value){
        console.log("Password confirmation doesn't match!")
        return false;
    }


    // if(!document.form.cpassword.value !=document.form.password.value){
    //     alert("Password confirmation doesn't match!")
    //     return false;
    // }
    // email validation 

    var mail = document.getElementById('email').mail.value;
    var mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (mailFormat.test(mail)) {
  
        console.log("Valid email address!");
    
        document.form1.text1.focus();
    
        return true;
    
      } else {
    
        console.log("Invalid email address!");
    
        document.form1.text1.focus();
    
        return false;
    
      }

}

