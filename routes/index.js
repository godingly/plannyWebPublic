var router = require('express').Router();

// function ensureAuth (req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   else 
//     res.redirect('/');
// }

function ensureAuth (req, res, next) {
  if (req.isAuthenticated())
    return next();
  else 
    res.redirect('/log');
}

function ensureGuest (req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/log');
  else
    return next();  
}

router.get('/' ,(req, res) => {
  res.render('index', {title:'planny', userinfo:req.user});
})

// router.get('/', ensureGuest ,(req, res) => {
//   res.render('login', {title:'planny'})
// })

// router.get("/log", ensureAuth, async(req,res)=>{
//   res.render('index', {userinfo:req.user, title: 'planny'})
// })

module.exports = router;
