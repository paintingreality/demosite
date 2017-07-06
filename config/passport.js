const
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User.js') //usermodel

//used to generate a cookie string by id
passport.serializeUser((user, done) => {
  done(null, user.id)
})
//used to decode cookie into user object by id
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

//signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  password: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'email': email}, (err, user) => { //checks to see if user exist
    console.log(req.body)
    if(err) return done(err)
    if(user) return done(null, false, req.flash('signupMessage', 'That email is taken.'))

//if the previous has no error this will create a user.
    var newUser = new User()
    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.password = req.body.password
    newUser.save((err, newlyCreatedUser) => {
      if(err) return console.log(err)
      return done(null, newlyCreatedUser, null)
    })
  })
}))

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'email': email}, (err,user) => {
    console.log(user.validPassword(password))
    console.log(user)
    if(err) return done(err)
    if(!user) return done(null, false, req.flash('loginMessage', 'No user found'))
    if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Incorrect password'))

    return done(null, user)
  })
}))

module.exports = passport
