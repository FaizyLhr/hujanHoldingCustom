let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const slug = require("slug");

let CommentsSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
		text: {
			type: String,
			trim: true,
			minlength: 1,
		},
		likes: {
			type: Array,
			default: null,
		},
		isDeleted: { type: Boolean, default: false },
		commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		commentedOn: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
	},
	{ timestamps: true }
);

CommentsSchema.plugin(mongoosePaginate);

CommentsSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

CommentsSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

CommentsSchema.methods.toJSON = function () {
	return {
		Comment: {
			text: this.text,
			likes: this.likes,
			commentedBy: this.commentedBy,
		},
	};
};

module.exports = mongoose.model("Comments", CommentsSchema);
