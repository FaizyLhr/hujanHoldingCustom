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
router.post("/add", isToken, (req, res, next) => {
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
	if (req.user.role === 1) {
		newNews.isSocial = false;
	}
	newNews.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(result));
	});
});

// View All Admin or Social News
router.get("/get/all/:role", isToken, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};
	let query = {};
	if (+req.params.role === 1) {
		query.isSocial = true;
	} else if (+req.params.role === 2) {
		query.isSocial = false;
	} else {
		return next(new BadRequestResponse("Params not Valid"));
	}

	News.paginate(query, options, function (err, result) {
		if (err) return next(new BadRequestResponse("Server Error"), 500);
		return next(new OkResponse({ result: result.docs }));
	});
});

// View Specific News
router.get("/get/:newsSlug", isToken, (req, res, next) => {
	if (!req.news) return next(new BadRequestResponse("No News Found"));
	return next(new OkResponse(req.news));
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

// Update Profile of User
router.put("/edit/:newsSlug", isToken, (req, res, next) => {
	if (req.body.title) {
		req.news.title = req.body.title;
	}
	if (req.body.body) {
		req.news.body = req.body.body;
	}
	if (req.body.image) {
		req.news.image = req.body.image;
	}

	req.news
		.save()
		.then((user) => next(new OkResponse(req.news)))
		.catch((err) => next(new BadRequestResponse(err)));
});

// delete a news by admin
router.delete("/del/:newsSlug", isToken, isAdmin, (req, res, next) => {
	req.news.remove((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(result));
	});
});

module.exports = router;
