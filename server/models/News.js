let mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const slug = require("slug");

let NewsSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
		title: { type: String, required: true, trim: true, minlength: 1 },
		body: { type: String, required: true, trim: true, minlength: 1 },
		image: { type: String, default: null },
		comments: { type: Array, default: null },
		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: mongoose.Types.ObjectId },
	},
	{ timestamps: true }
);

NewsSchema.plugin(mongoosePaginate);

function prePopulate(next) {
	this.populate("postedBy");
	next();
}

NewsSchema.pre("find", prePopulate);
NewsSchema.pre("findOne", prePopulate);
NewsSchema.pre("findById", prePopulate);

NewsSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

NewsSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

NewsSchema.methods.toJSON = function () {
	return {
		slug: this.slug,
		title: this.title,
		body: this.body,
		image: this.image,
		postedBy: this.postedBy,
	};
};

module.exports = mongoose.model("News", NewsSchema);
