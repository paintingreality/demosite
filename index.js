const
  dotenv = require('dotenv').load({silent: true}),
  express = require('express'),
  app = express(),
  server = require('http').Server(app),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoDBSStore = require('connect-mongodb-session')(session),
  passport = require('passport'),
  passportConfig = require('./config/passport.js'),
  userRoutes = require('./routes/users.js')


const
// this port was changed instead of port 3000. npm package wont work on localhost 3000
  port = process.env.PORT || 27017
  mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost:27017/demo_sites'
//mongodb connection
mongoose.connect(mongoConnectionString, (err) => {
  console.log(err || "connected to MongoDB (demo_sites)")
})

const store = new MongoDBSStore({
  uri: mongoConnectionString,
  collections: 'sessions'
});

// middleware
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(flash())

app.use(methodOverride('_method'))
//static images in public folder.
app.use(express.static(__dirname + '/public'))

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//sessions information
app.use(session({
	secret: "trees",
	cookie: {maxAge: 60000000},
	resave: true,
	saveUninitialized: false,
	store: store
}))
//passport
app.use(passport.initialize())
app.use(passport.session())
//current user logged in?
app.use((req, res, next) => {
	app.locals.currentUser = req.user
	app.locals.isLoggedIn = !!req.user

	next()
})

//root route
app.get('/', (req,res) => {
	res.render('index')
})

//user route
app.use('/', userRoutes)



//port (localhost:27017)
app.listen(port, (err) => {
	console.log(err || "Server running on port " + port)
})
