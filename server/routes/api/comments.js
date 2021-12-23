let router = require("express").Router();

let { OkResponse, BadRequestResponse } = require("express-http-response");

const CommentsModel = require("../../models/Comments");
const NewsModel = require("../../models/News");

const { isAdmin, isUser, isToken, isCommentDel } = require("../auth");

// get Comment for every time commentSlug given
router.param("commentSlug", (req, res, next, slug) => {
	CommentsModel.findOne({ slug }, (err, comment) => {
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
	NewsModel.findOne({ slug }, (err, news) => {
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

	// Validate User input
	if (!req.body.text) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	} else if (req.body.text.length === 0) {
		return next(new BadRequestResponse("Missing required parameter", 422));
	}

	// Create user in our database
	let newComment = CommentsModel();
	console.log(req.body);

	if (req.body.text) {
		newComment.text = req.body.text;
	}

	// console.log(newComment);

	newComment.commentedBy = req.user._id;
	newComment.commentedOn = req.news._id;

	newComment.save((err, result) => {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse(err));
		} else {
			req.news.comments.push(newComment._id);
			req.news.save((err, data) => {
				if (err) {
					// console.log(err);
					return next(new BadRequestResponse(err));
				} else {
					// console.log(data);
					console.log("Id Added");
				}
			});
			// console.log(result);
			return next(new OkResponse(result.toJSON()));
		}
	});
});

// View All Comments
router.get("/all/:newsSlug", isToken, (req, res, next) => {
	const options = {
		page: +req.query.page || 1,
		limit: +req.query.limit || 10,
		populate: "commentedBy",
	};
	// console.log(req.news._id);

	let query = {};
	query.commentedOn = req.news._id;
	query.isDeleted = false;

	CommentsModel.paginate(query, options, function (err, result) {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse("Server Error"), 500);
		}
		// console.log(result.docs);
		result.docs = result.docs.map((news) => news.toJSON());
		return next(new OkResponse({ result: result.docs }));
	}).catch((e) => {
		// console.log(e);
		return next(new BadRequestResponse(e.error));
	});
});

// View Specific Comment
router.get("/:commentSlug", isToken, (req, res, next) => {
	console.log(req.comment);
	if (req.comment) {
		console.log("comment");

		return next(new OkResponse(req.comment.toJSON()));
	} else {
		return next(new BadRequestResponse("comment not found!", 423));
	}
});

//Change Status Delete a Comment
router.put("/del/:commentSlug", isToken, isCommentDel, (req, res, next) => {
	// console.log(req.user);
	req.comment.isDeleted = true;
	req.comment.save((err, result) => {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse(err));
		} else {
			// console.log(result);
			return next(new OkResponse(req.comment.toJSON()));
		}
	});
});

module.exports = router;
