const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy;

const UserModel = require("../models/User");

const localStrategy = new LocalStrategy(
	{ usernameField: "userName", passwordField: "password" },
	(userName, password, done) => {
		UserModel.findOne({ userName }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "Incorrect UserName Address" });
			}
			if (user.validPassword(password) != true) {
				return done(null, false, { message: "Incorrect Password" });
			}
			return done(null, user);
		});
	}
);

module.exports = { localStrategy };
