const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy;

let { BadRequestResponse, UnauthorizedResponse, ForbiddenResponse } = require("express-http-response");

const User = require("../models/User");

const localStrategy = new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
	User.findOne({ email }, (err, user) => {
		if (err) return done(err);
		if (!user) return done(null, false, { message: "Incorrect UserName Address" });
		if (user.validPassword(password) != true) {
			return done(null, false, { message: "Incorrect Password" });
		}
		return done(null, user);
	});
});

module.exports = { localStrategy };
