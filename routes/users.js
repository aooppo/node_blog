var express = require('express');
var router = express.Router();
const User = require("../userProvider-memory");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', async (req, res) => {

  let nameError = req.flash("nameError");
  let emailError =req.flash("emailError");
  let emailExistsError =req.flash("emailExistsInDb");
  let passwordError =req.flash("passwordError");
  let name = req.flash("name");
  let email =  req.flash("email"); 

  nameError = (nameError.length == 0) ? undefined : nameError;
  emailError = (emailError.length == 0) ? undefined : emailError;
  emailExistsError = (emailExistsError.length == 0) ? undefined : emailExistsError;
  passwordError = (passwordError.length == 0) ? undefined : passwordError;
  console.log(nameError)

  res.render('users/register', {nameError, emailError, emailExistsError, passwordError, name, email});
});

router.post('/save', async (req, res) => {
  let {name, email, passwd} = req.body;
  let nameError, emailError, emailExistsError, passwordError;

  // Fields validation
  if(name == undefined || name == ""){
    nameError = "Invalid name";
  }
  let emailIsValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  if(!emailIsValid){
    emailError = "Invalid email";
  }
  if(passwd == "" || passwd.length < 5){
    passwordError = "Invalid password";
  }
  let emailExistsInDb = await User.findByEmail(email);

  if(emailExistsInDb){
    emailExistsError = "E-mail already registered";
  }

  if(nameError != undefined || emailError != undefined || passwordError != undefined || emailExistsInDb != undefined){
    req.flash("nameError", nameError)
    req.flash("emailError", emailError)
    req.flash("emailExistsInDb", emailExistsError)
    req.flash("passwordError", passwordError)
    req.flash("name", name);
    req.flash("email", email);   
    res.redirect("/users/register");

  };
  // Save in db
  let save = await User.create(name, email, passwd);

  if(save){
    req.session.user = {name,email,passwd}
    res.redirect("/");
  }
  else 
    res.redirect("/users/register");
});

router.get("/login", (req, res) => {
  let emailError = req.flash("emailError");
  let passwordError = req.flash("passwordError");
  
  emailError = emailError.length == 0 ? undefined : emailError;
  passwordError = passwordError.length == 0 ? undefined : passwordError;

  res.render("users/login", {emailError, passwordError});
});

router.post("/auth", async (req, res) => {

  let {email, passwd} = req.body;
  let emailError, passwordError;
  
  let result = await User.findByEmail(email);

  if(result){
    try {
      let auth = await bcrypt.compare(passwd, result.user.passwd);
      if(auth){
        req.session.user = result;
        res.redirect("/arts");
      }
      else{
        passwordError = "Invalid password";
    
      }
    } catch (error) {
      res.send("500 Internal server error");
    }
  }
  else{
    emailError = "email not registered";
  }
  req.flash("emailError", emailError);
  req.flash("passwordError", passwordError);
  res.redirect("/users/login");

});
router.get("/logout", auth, (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
})
module.exports = router;
