"use strict";
const nodemailer = require("nodemailer");
module.exports = {
	PORT: 3000,
	MONGODB_URI: "mongodb://localhost:27017/hujanholdingCustom",
	secret: "secret",
	host: "localhost:3000",
	// link: 'localhost:4200',
	link: "http://165.22.228.6",
	smtpAuth: {
		user: "hello@travel19.co.uk",
		pass: "hDXyWdPzZ3fVEOk5",
	},
	goldApiServerKey: "goldapi-rhyobukljsd1uh-io",
};
