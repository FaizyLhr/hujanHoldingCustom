let router = require("express").Router();

const passport = require("passport");

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const UserModel = require("../../models/User");

const getToken = require("../../utilities/getToken");

const {
	isAdmin,
	isToken,
	isUser,
	isVerified
} = require("../auth");

var emailService = require("../../utilities/emailService");

// Acquiring Passport
const {
	localStrategy
} = require("../../utilities/passport");

// console.log(localStrategy);
passport.use(localStrategy);
router.use(passport.initialize());

// get user for every time mail given
router.param("email", (req, res, next, email) => {
	UserModel.findOne({
		email
	}, (err, user) => {
		if (!err && user !== null) {
			// console.log(user);
			req.emailUser = user;
			return next();
		}
		next(new BadRequestResponse("User not found!", 423));
		return;
	});
});

// General Check
router.get("/", function (req, res, next) {
	return next(new OkResponse({
		message: `Users Api's are working`
	}));
});

// Signup
router.post("/signUp", (req, res, next) => {
	// console.log(req.body.user);

	if (
		!req.body.user.email ||
		!req.body.user.userName ||
		!req.body.user.password ||
		!req.body.user.firstName ||
		!req.body.user.lastName
	) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	} else if (
		req.body.user.email.length === 0 ||
		req.body.user.userName.length === 0 ||
		req.body.user.password.length === 0 ||
		req.body.user.firstName.length === 0 ||
		req.body.user.lastName.length === 0
	) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	}

	// Create user in our database
	let newUser = UserModel();

	newUser.email = req.body.user.email;
	newUser.userName = req.body.user.userName;
	newUser.firstName = req.body.user.firstName;
	newUser.lastName = req.body.user.lastName;

	newUser.setPassword(req.body.user.password);

	// console.log("otp");
	newUser.setOTP();

	// console.log(newUser);
	newUser.save((err, result) => {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse(err));
		} else {
			// console.log(result);
			// emailService.sendEmailVerificationOTP(result);
			return next(
				new OkResponse('success')
			);
		}
	});
});

// Login
router.post(
	"/login",
	passport.authenticate("local", {
		session: false
	}),
	getToken,
	(req, res, next) => {
		if (req.user.status === 0) {
			return next(new OkResponse(req.user.toAuthJSON()));
		}
		return next(new BadRequestResponse("User is not active by the admin.", 423));
		// return next(new OkResponse(req.user.toJSON()));
	}
);

// Change Status of user
router.put(
	"/verify/:email/:changeStatus",
	isToken,
	isAdmin,
	async (req, res, next) => {
		if (req.emailUser.status == req.params.changeStatus) {
			return next(new BadRequestResponse("Status Already Changed"));
		}
		// console.log(req.user);
		// console.log(req.params.changeStatus);
		req.emailUser.status = req.params.changeStatus;
		req.emailUser.save((err, result) => {
			if (err) {
				// console.log(err);
				return next(new BadRequestResponse(err));
			} else {
				// console.log(result);
				return next(new OkResponse(req.emailUser.toJSON()));
			}
		});
	}
);

// View All users
router.get("/all/:changeStatus", isToken, isAdmin, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};
	query.role = 2;
	if (req.params.changeStatus === 0) {
		query.status = {
			$ne: 2
		}
	} else if (req.params.changeStatus === 1) {
		query.status = req.params.changeStatus;
	} else {
		return next(new UnauthorizedResponse("Param is not a Valid"));
	}

	UserModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse("Server Error"), 500);
		}

		return next(new OkResponse({
			result: result.docs
		}));
	}).catch((e) => {
		console.log(e);
		next(new BadRequestResponse(e.error));
		return;
	});
});

// User context Api
router.get("/context", isToken, function (req, res, next) {
	console.log("Email");
	let user = req.user;
	return next(new OkResponse(user.toAuthJSON()));
});

module.exports = router;