let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
var otpGenerator = require("otp-generator");
let secret = require("../config").secret;
const mongoosePaginate = require("mongoose-paginate-v2");

let UserSchema = new mongoose.Schema(
	{
		email: { type: String, lowercase: true, required: true, trim: true, index: true, unique: true, sparse: true },
		firstName: { type: String, required: true, minLength: 3, default: null, trim: true },
		lastName: { type: String, required: true, minLength: 3, default: null, trim: true },
		userName: { type: String, unique: true, sparse: true, index: true, required: true, minLength: 3, trim: true },
		img: { type: String, default: "" },

		role: {
			type: Number,
			default: 2, // default 2- User
			enum: [
				1, // 1: Admin
				2, // 2: User
			],
		},

		status: {
			type: Number,
			default: 1,
			enum: [
				0, //Active
				1, //Blocked
				2, //Delete
				3, //Rejected
			],
		},

		hash: String,
		salt: String,
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.validPassword = function (password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
	return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

UserSchema.methods.generateJWT = function () {
	return jwt.sign({ id: this._id, email: this.email }, secret, { expiresIn: "60d" });
};

UserSchema.methods.toJSON = function () {
	return {
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		userName: this.userName,
		status: this.status,
		img: this.img,
		role: this.role,
	};
};

UserSchema.methods.toAuthJSON = function () {
	return {
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		userName: this.userName,
		status: this.status,
		img: this.img,
		role: this.role,
		token: this.generateJWT(),
	};
};

module.exports = mongoose.model("User", UserSchema);
