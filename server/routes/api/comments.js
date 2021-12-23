let router = require("express").Router();

let { OkResponse, BadRequestResponse } = require("express-http-response");

const Comments = require("../../models/Comments");
const News = require("../../models/News");

const { isAdmin, isUser, isToken } = require("../auth");
const { isCommentDel } = require("../../middlewares/middlewares");

// get Comment for every time commentSlug given
router.param("commentSlug", (req, res, next, slug) => {
	Comments.findOne({ slug }, (err, comment) => {
		if (!err && comment !== null) {
			// console.log(comment);
			req.comment = comment;
			return next();
		}
		return next(new BadRequestResponse("Comment not found!", 423));
	});
});

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

// Add Comment
router.post("/add/:newsSlug", isToken, isAdmin, (req, res, next) => {
	// console.log(!req.body.news);
	console.log(req.news);
	// console.log(!req.body.news);

	// Validate User input
	if (!req.body.text) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	} else if (req.body.text.trim().length === 0) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	}

	console.log("news");
	// Create user in our database
	let newComment = Comments();

	if (req.body.text) {
		newComment.text = req.body.text;
	}
	newComment.commentedBy = req.user._id;
	newComment.commentedOn = req.news._id;

	newComment.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		req.news.comments.push(newComment._id);
		req.news.save((err, data) => {
			if (err) return next(new BadRequestResponse(err));
			console.log("Id Added");
		});
		// console.log(result);
		return next(new OkResponse(result));
	});
});

// View All Comments
router.get("/get/all/:newsSlug", isToken, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
	};

	let query = {};
	query.commentedOn = req.news._id;
	query.isDeleted = false;

	Comments.paginate(query, options, function (err, result) {
		if (err) return next(new BadRequestResponse("Server Error"), 500);
		return next(new OkResponse({ result: result.docs }));
	});
});

// View Specific Comment
router.get("/get/:commentSlug", isToken, (req, res, next) => {
	// console.log(req.comment);
	if (req.comment) return next(new OkResponse(req.comment));
	return next(new BadRequestResponse("comment not found!", 423));
});

//Change Status Delete a Comment
router.put("/del/:commentSlug", isToken, isCommentDel, (req, res, next) => {
	// console.log(req.user);
	req.comment.isDeleted = true;
	req.comment.save((err, result) => {
		if (err) return next(new BadRequestResponse(err));
		return next(new OkResponse(req.comment));
	});
});

module.exports = router;
