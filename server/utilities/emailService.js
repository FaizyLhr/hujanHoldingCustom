const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const smtpAuth = require("../config").smtpAuth;

const sendEmail = (mailDetails) => {
	const transporter = nodemailer.createTransport({
		host: "smtp-relay.sendinblue.com",
		port: 587,
		auth: smtpAuth,
	});
	// Open template file
	var source = fs.readFileSync(path.join(__dirname, "../templates/email.hbs"), "utf8");
	// Create email generator
	var template = Handlebars.compile(source);
	transporter.sendMail({ ...mailDetails, html: template(mailDetails.templateObj) }, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log("Email sent", info);
		}
	});
};

const sendReportEmail = async (report) => {
	sendEmail({
		from: " Certificate <donotreply@travel19.co.uk",
		to: report.email,
		subject: "Certificate",
		templateObj: {
			...report,
			emailText: `<p>Please find Attached PDF to check your report</p>`,
		},
		attachments: [
			{
				filename: "Report.pdf",
				path: process.cwd() + `/server/public/pdf/${report.referenceNumber.toLowerCase()}.pdf`,
				contentType: "application/pdf",
			},
		],
	});
};

const sendInvalidReportEmail = async (user) => {
	sendEmail({
		from: " Certificate Notification <donotreply@travel19.co.uk",
		to: user.email,
		subject: "Certificate Email Verification",
		templateObj: {
			...user,
			emailText: `<p>Your provided info is invalid. Please provide a valid info to generate a certificate.</p>`,
		},
	});
};

const sendEmailVerificationOTP = async (user) => {
	sendEmail({
		from: " Certificate Notification <donotreply@travel19.co.uk",
		to: user.email,
		subject: "Certificate Email Verification",
		templateObj: {
			...user,
			emailText: `<p>Please verify that your email address is ${user.email} and that you entered it when signing up for Certificate.</p>
       <p>Enter this OTP to complete the Signup.</p>`,
		},
	});
};

const sendEmailVerificationSuccess = async (user) => {
	sendEmail({
		from: " Certificate Notification <donotreply@travel19.co.uk",
		to: user.email,
		subject: "Your Email verified successfully",
		templateObj: {
			...user,
			emailText: `
      <h1>Welcome to Certificate</h1>. <br>
        you have successfully verified your email address. <br>
        <i>Let's Play</i>
      `,
		},
	});
};
const sendEmailOTP = async (user) => {
	sendEmail({
		from: " Certificate Notification <donotreply@travel19.co.uk",
		to: user.email,
		subject: "OTP Request",
		templateObj: {
			...user,
			emailText: `
      <p>We received an OTP request on your Certificate Account.</p>.
      <p>Enter this OTP to complete the process.</p>
      `,
		},
	});
};

const sendEmailForgotPasswordSuccess = async (user) => {
	sendEmail({
		from: " Certificate Notification <donotreply@travel19.co.uk",
		to: user.email,
		subject: "Your Account's password has been reset",
		templateObj: {
			...user,
			emailText: `
      Your password for the ${user.email} has been reset successfully. <br>
        <i>Let's Play</i>
      `,
		},
	});
};

const sendEmailCreateAdmin = async (user) => {
	sendEmail({
		from: " Certificate Notification <donotreply@travel19.co.uk",
		to: user.email,
		subject: "Your Admin Account is live",
		templateObj: {
			...user,
			emailText: `
      Congratulations – your account is live and ready for action. You now have access to Certificate admin.
      Your password for the ${user.email} need to be reset. <br>
      `,
		},
	});
};
module.exports = {
	sendEmailVerificationOTP,
	sendEmailVerificationSuccess,
	sendEmailOTP,
	sendEmailForgotPasswordSuccess,
	sendEmailCreateAdmin,
	sendReportEmail,
	sendInvalidReportEmail,
	// sendEmailForgotPasswordOTP,
};
