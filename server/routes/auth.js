const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
let secret = require("../config").secret;

let {
	BadRequestResponse,
	UnauthorizedResponse,
	ForbiddenResponse,
} = require("express-http-response");

function isAdmin(req, res, next) {
	// console.log("admin");
	// console.log(req.user);
	if (!req.user) {
		// console.log("chk");
		next(new BadRequestResponse("No User Found"));
		return;
	}
	if (!(req.user.role === 1)) {
		// console.log("Not Admin");
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
	// console.log(req.user);
	// console.log("Admin PAssed");
	next();
}

function isUser(req, res, next) {
	// console.log(req.user);
	if (!req.user) {
		next(new BadRequestResponse("No User Found"));
		return;
	}
	if (!(req.user.role === 2)) {
		next(new UnauthorizedResponse("Access Denied"));
		return;
	}
	// console.log("passed");
	next();
}

function isBlocked(req, res, next) {
	// console.log(req.user.status);
	if (req.emailUser.status === 2) {
		next(new ForbiddenResponse("User Already Blocked"));
		return;
	}
	next();
}

function isVerified(req, res, next) {
	// console.log(req.user);
	if (req.emailUser.isVerified === true) {
		return next(new ForbiddenResponse("User Already Verified"));
	}
	next();
}

function isUnBlocked(req, res, next) {
	// console.log(req.user.status);

	// console.log(req.user);
	if (req.emailUser.status === 1) {
		next(new ForbiddenResponse("User Already UnBlocked"));
		return;
	}
	next();
}

const isToken = function (req, res, next) {
	// console.log(req.headers.authorization);
	if (
		req.headers.authorization === undefined ||
		req.headers.authorization.length === 0
	) {
		// console.log(req.headers.authorization);
		return next(new UnauthorizedResponse("You are not logged in"));
	}
	var token = req.headers.authorization.split(" ");
	// console.log(token[1]);
	if (typeof token[1] === undefined || typeof token[1] === null) {
		next(new UnauthorizedResponse("You are not logged in"));
		return;
	} else {
		jwt.verify(token[1], secret, (err, data) => {
			// console.log(data.email);
			if (err) {
				// console.log(err);
				next(new UnauthorizedResponse(err));
				return;
			} else {
				UserModel.findOne({ email: data.email })
					.then((user) => {
						// console.log(user);
						req.user = user;
						// console.log("Token");
						// console.log(req.user);
						next();
					})
					.catch((err) => next(err));
			}
		});
	}
};

function isCommentDel(req, res, next) {
	// console.log(req.msg.isFav);
	if (req.comment.isDeleted === true) {
		return next(new ForbiddenResponse("Comment Already Deleted"));
	}
	next();
}

module.exports = {
	isAdmin,
	isUser,
	isVerified,
	isToken,
	isBlocked,
	isUnBlocked,
	isCommentDel,
};
