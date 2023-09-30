
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	resetToken: { type: String },
	expirationToken: { type: Date },
	photo: {
		type: Buffer,
	},
	photoType: {
		type: String,
	},
	followers: [{ type: ObjectId, ref: "User" }],
	following: [{ type: ObjectId, ref: "User" }],
	bookmarks: [{ type: ObjectId, ref: "Post" }],
});


module.exports = mongoose.model("User", userSchema);
