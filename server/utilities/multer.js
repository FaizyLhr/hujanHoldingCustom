const path = require("path");
const multer = require("multer");

const fileFilter = (req, file, cb) => {
	if (file.mimetype.toLowerCase() === "image/jpeg" || file.mimetype.toLowerCase() === "image/jpg" || file.mimetype.toLowerCase() === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(path.join(__dirname + "../public/uploads"));
		// console.log(path.join(process.cwd(), "server/public", "uploads"));
		cb(null, path.join(__dirname + "../public/uploads"));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 30,
	},
	fileFilter,
});

module.exports = { upload };
