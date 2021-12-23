let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
var otpGenerator = require("otp-generator");
let secret = require("../config").secret;
const mongoosePaginate = require("mongoose-paginate-v2");

let UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			required: true,
			trim: true,
			index: true,
			unique: true,
			sparse: true,
		},
		firstName: {
			type: String,
			required: true,
			minLength: 3,
			default: null,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			minLength: 3,
			default: null,
			trim: true,
		},
		userName: {
			type: String,
			unique: true,
			sparse: true,
			index: true,
			required: true,
			minLength: 3,
			trim: true,
		},
		img: { type: String, default: null },

		// isEmailVerified: { type: Boolean, default: true },
		otp: { type: String, default: null },
		otpExpires: { type: Date, default: null },
		isOtpVerified: { type: Boolean, default: false },
		resetPasswordToken: { type: String, default: null },

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
			],
		},

		// isVerified: { type: Boolean, default: false },

		hash: String,
		salt: String,
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.validPassword = function (password) {
	let hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
		.toString("hex");
	return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
		.toString("hex");
};

UserSchema.methods.setOTP = function () {
	this.otp = otpGenerator.generate(4, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		// alphabets: false,
		// upperCase: false,
		specialChars: false,
	});
	this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generatePasswordRestToken = function () {
	this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
};

UserSchema.methods.generateJWT = function () {
	// let today = new Date();
	// let exp = new Date(today);
	// exp.setDate(today.getDate() + 60);

	return jwt.sign(
		{
			id: this._id,
			email: this.email,
			// exp: parseInt(exp.getTime() / 1000),
		},
		secret,
		{ expiresIn: "60d" }
	);
};

UserSchema.methods.toJSON = function () {
	return {
		user: {
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			userName: this.userName,
			status: this.status,
			img: this.img,
			role: this.role
		},
	};
};

UserSchema.methods.toAuthJSON = function () {
	return {
		user: {
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			userName: this.userName,
			status: this.status,
			img: this.img,
			token: this.generateJWT(),
			role:this.role,
		},
	};
};

module.exports = mongoose.model("User", UserSchema);
