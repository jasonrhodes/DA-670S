var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// homepage setup
router.get('/', function (req, res) {
	res.render('home');
});

// register page setup
router.get('/register', function (req, res) {
	res.render('register');
});

// login page setup
router.get('/login', function (req, res) {
	res.render('login');
});

// logout function setup
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// register post
router.post('/register', function (req, res) {

    var username: req.body.username,
    var password: req.body.password

    if (err){
    	throw err;
    } else {
    	var newUser = new User ({
    		username: username,
    		password: password
    	});

    	newUser.save(function (err) {
    		if (err) {
    			res.status(500).send({ message: "Error creating user"})
    		}
    	});

    	// User.createUser(newUser, function (err, user) {
    	// 	if (err) throw err;
    	// 	console.log(user);
    	// });

    	req.flash('message', 'You have successfully registered!');

    	res.redirect('/');
    }	
});

// login post & auth
routher.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
	}),
	function (req, res) {
		res.redirect('/');
	});

// passport config
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user){
				return done (null, false, req.flash('message', 'User not found'));
			}

			User.checkPassword(password, user.password, function (err, isValidPassword) {
				if (err) throw err;
				if (isValidPassword) {
					return done(null, user);
				} else {
					return done(null, false, req.flash('message', 'Invalid password'));
				}
		});
	});
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});


module.exports = router;




