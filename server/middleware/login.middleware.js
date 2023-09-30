
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

module.exports = (req, res, next) => {

	const token = req.cookie.authToken;
	if (!token) {
		return res.status(401).json({ error: "You must be logged In." });
	}
	
	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			return res.status(401).json({ error: "You session has been expired." });
		}
		const { _id } = payload;
		User.findOne(_id).then((userdata) => {
			// We make user data accessible
			req.user = userdata;
			next();
		});
	});
};
