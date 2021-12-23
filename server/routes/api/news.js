let router = require("express").Router();

let { OkResponse, BadRequestResponse } = require("express-http-response");

const News = require("../../models/News");

const { isAdmin, isUser, isToken } = require("../auth");

// get News for every time newsSlug given
router.param("newsSlug", (req, res, next, slug) => {
	News.findOne({ slug }, (err, news) => {
		if (!err && news !== null) {
			// console.log(news);
			req.news = news;
			return next();
		}
		return next(new BadRequestResponse("News not found!", 423));
	});
});

// Add News
router.post("/add", isToken, isAdmin, (req, res, next) => {
	// console.log(req.body);

	// Validate User input
	if (!req.body.news || !req.body.news.title || !req.body.news.body) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	} else if (req.body.news.title.length === 0 || req.body.news.body.length === 0) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	}
	// Create user in our database
	let newNews = News();
	if (req.body.news.title) {
		newNews.title = req.body.news.title;
	}
	if (req.body.news.body) {
		newNews.body = req.body.news.body;
	}
	newNews.postedBy = req.user._id;

	newNews.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(result));
	});
});

// View All News
router.get("/get/all", isToken, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};
	let query = {};
	News.paginate(query, options, function (err, result) {
		if (err) return next(new BadRequestResponse("Server Error"), 500);
		return next(new OkResponse({ result: result.docs }));
	});
});

router.delete("/del/:newsSlug", isToken, isAdmin, (req, res, next) => {
	req.news.remove((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(result));
	});
});
module.exports = router;
