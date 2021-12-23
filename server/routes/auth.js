const jwt = require("jsonwebtoken");
const User = require("../models/User");
let secret = require("../config").secret;

let { BadRequestResponse, UnauthorizedResponse, ForbiddenResponse } = require("express-http-response");

function isAdmin(req, res, next) {
	isToken();
	if (!req.user) return next(new BadRequestResponse("No User Found"));
	if (!(req.user.role === 1)) return next(new UnauthorizedResponse("Access Denied"));
	next();
}

function isUser(req, res, next) {
	isToken();
	if (!req.user) return next(new BadRequestResponse("No User Found"));
	if (!(req.user.role === 2)) return next(new UnauthorizedResponse("Access Denied"));
	next();
}

const isToken = function (req, res, next) {
	if (req.headers.authorization === undefined || req.headers.authorization.length === 0) {
		return next(new UnauthorizedResponse("You are not logged in"));
	}

	var token = req.headers.authorization.split(" ");
	if (typeof token[1] === undefined || typeof token[1] === null) {
		return next(new UnauthorizedResponse("You are not logged in"));
	}

	jwt.verify(token[1], secret, (err, data) => {
		if (err) return next(new UnauthorizedResponse(err));

		User.findOne({ email: data.email })
			.then((user) => {
				req.user = user;
				next();
			})
			.catch((err) => next(err));
	});
};

module.exports = {
	isAdmin,
	isUser,
	isToken,
};
