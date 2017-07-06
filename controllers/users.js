const
  User = require('../models/User.js'),
  server = require('../index.js')

module.exports = {
  index,
  show,
  edit,
  create,
  update,
  destroy
}

function index(req, res) {
  User.find({}, '-__v', (err, users) => {
    res.json(users)
  })
}

function show(req, res) {
  User.findById(req.params.id, (err, user) => {
    res.json(user)
  })
}

function edit(req, res) {
  res.render('edit', {user: req.user})
}

function create(req, res) {
  User.create(req.body, (err, user) => {
    res.json({success: true, message: "Account has been created"})
  })
}

function update(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) return console.log(err)
    Object.assign(user, req.body)
    user.save((err) => {
      res.redirect('/profile')
    })
  })
}

function destroy(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return console.log(err)
    res.json({success: true, message: "Account Deleted"})
  })
}
