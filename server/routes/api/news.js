let router = require("express").Router();

let {
	OkResponse,
	BadRequestResponse,
	UnauthorizedResponse,
} = require("express-http-response");

const NewsModel = require("../../models/News");

const { isAdmin, isUser, isToken } = require("../auth");

// Add News
router.post("/addNews", isToken, isAdmin, (req, res, next) => {
	console.log(req.body);

	// Validate User input

	if (
		!req.body.news ||
		!req.body.news.title ||
		!req.body.news.body 
	) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	} else if (
		req.body.news.title.length === 0 ||
		req.body.news.body.length === 0 
	) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	}
	// Create user in our database
	let newNews = NewsModel();

	if (req.body.news.title) {
		newNews.title = req.body.news.title;
	}
	console.log("out");
	if (req.body.news.body) {
		newNews.body = req.body.news.body;
	}

	console.log(newNews);

	newNews.postedBy = req.user._id;

	newNews.save((err, result) => {
		if (err) {
			console.log(err);
			return next(new BadRequestResponse(err));
		} else {
			// console.log(result);
			return next(new OkResponse(result));
		}
	});
});

// View All News
router.get("/all", isToken, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: "postedBy",
	};

	let query = {};

	NewsModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse("Server Error"), 500);
		}
		// console.log(result);
		result.docs = result.docs.map((news) => news.toJSON());
		return next(new OkResponse({ result: result.docs }));
	}).catch((e) => {
		// console.log(e);
		return next(new BadRequestResponse(e.error));
	});
});

module.exports = router;
