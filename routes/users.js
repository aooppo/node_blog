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
  res.render('users/register');
});

router.post('/save', async (req, res) => {
  let {name, email, passwd} = req.body;
  let save = await User.create(name, email, passwd);
  
  if(save) 
    res.redirect("/");
  else 
    res.redirect("/users/register");
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/auth", async (req, res) => {

  let {email, passwd} = req.body;
  
  if(email == undefined){
    res.redirect("/users/login");
  }
  else if(passwd == undefined){
      res.redirect("/users/login");
  }
  let result = await User.findByEmail(email);

  if(result){
    try {
      let auth = await bcrypt.compare(passwd, result.user.passwd);
      if(auth){
        req.session.user = result;
        res.redirect("/arts");
      }
      else{
        res.redirect("/users/login");    
      }
    } catch (error) {
      res.send("500 Internal server error");
    }
  }
  else{
    res.send("Usuario não encontrado")
  }

});
module.exports = router;
