//user model
const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String
  })
  //generates user password.
  userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  // checks to see if password matches.
  userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
  }
  //makes model avail in other files.
  userSchema.pre('save', function(next) {
    const user = this
    if(!user.isModified('password')) return next()
    user.password = user.generateHash(user.password)
    next()
  })
  //module for user schema
  module.exports = mongoose.model('User', userSchema)
