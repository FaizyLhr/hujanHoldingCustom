const jwt = require("jsonwebtoken");
const User = require("../models/User");
let secret = require("../config").secret;

let { BadRequestResponse, UnauthorizedResponse, ForbiddenResponse } = require("express-http-response");

function isBlocked(req, res, next) {
	if (req.emailUser.status === 2) return next(new ForbiddenResponse("User Already Blocked"));
	next();
}

function isUnBlocked(req, res, next) {
	if (req.emailUser.status === 1) return next(new ForbiddenResponse("User Already UnBlocked"));
	next();
}

function isCommentDel(req, res, next) {
	if (req.comment.isDeleted === true) return next(new ForbiddenResponse("Comment Already Deleted"));
	next();
}

module.exports = {
	isBlocked,
	isUnBlocked,
	isCommentDel,
};
