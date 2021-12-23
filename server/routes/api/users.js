let router = require("express").Router();

const passport = require("passport");

let { OkResponse, BadRequestResponse, UnauthorizedResponse } = require("express-http-response");

const User = require("../../models/User");

const { isAdmin, isToken, isUser } = require("../auth");

// Acquiring Passport
const { localStrategy } = require("../../utilities/passport");

passport.use(localStrategy);
router.use(passport.initialize());

// get user for every time mail given
router.param("email", (req, res, next, email) => {
	User.findOne({ email }, (err, user) => {
		if (!err && user !== null) {
			req.emailUser = user;
			return next();
		}
		return next(new BadRequestResponse("User not found!", 423));
	});
});

// General Check
router.get("/", function (req, res, next) {
	return next(new OkResponse({ message: `Users Api's are working` }));
});

// Signup
router.post("/signUp", (req, res, next) => {
	if (!req.body.user.email || !req.body.user.userName || !req.body.user.password || !req.body.user.firstName || !req.body.user.lastName) {
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
	let newUser = User();

	newUser.email = req.body.user.email;
	newUser.userName = req.body.user.userName;
	newUser.firstName = req.body.user.firstName;
	newUser.lastName = req.body.user.lastName;
	newUser.setPassword(req.body.user.password);

	newUser.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse("success"));
	});
});

// Login
router.post("/login", passport.authenticate("local", { session: false }), (req, res, next) => {
	if (req.user.status !== 0) return next(new BadRequestResponse("User is not active by the admin.", 423));
	return next(new OkResponse(req.user.toAuthJSON()));
});

// Change Status of user
router.put("/verify/:email/:changeStatus", isToken, isAdmin, async (req, res, next) => {
	if (req.emailUser.status == req.params.changeStatus) return next(new BadRequestResponse("Status Already Changed"));
	req.emailUser.status = req.params.changeStatus;
	req.emailUser.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(req.emailUser.toJSON()));
	});
});

// View All Non Deleted users
router.get("/all/:changeStatus", isToken, isAdmin, (req, res, next) => {
	const options = { page: +req.query.page || 1, limit: +req.query.limit || 10 };

	let query = {};
	query.role = 2;

	if (req.params.changeStatus === 0) {
		query.status = { $ne: 2 };
	} else if (req.params.changeStatus === 1) {
		query.status = req.params.changeStatus;
	} else {
		return next(new UnauthorizedResponse("Param is not a Valid"));
	}

	User.paginate(query, options, function (err, result) {
		if (err) return next(new BadRequestResponse("Server Error"), 500);
		return next(new OkResponse({ result: result.docs }));
	}).catch((e) => {
		return next(new BadRequestResponse(e.error));
	});
});

// User context Api
router.get("/context", isToken, function (req, res, next) {
	console.log("Email");
	let user = req.user;
	return next(new OkResponse(user.toAuthJSON()));
});

module.exports = router;
