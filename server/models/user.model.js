
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
	ResetToken: { type: String },
	ExpirationToken: { type: Date },
	Photo: {
		type: Buffer,
	},
	PhotoType: {
		type: String,
	},
	Followers: [{ type: ObjectId, ref: "User" }],
	Following: [{ type: ObjectId, ref: "User" }],
	Bookmarks: [{ type: ObjectId, ref: "Post" }],
});


module.exports = mongoose.model("User", userSchema);
