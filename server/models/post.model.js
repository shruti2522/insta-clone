
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		photo: {
			type: Buffer,
			default: "no photo",
		},
		photoType: {
			type: String,
		},
		postedBy: {
			type: ObjectId,
			ref: "User",
		},
		likes: [{ type: ObjectId, ref: "User" }],
		comments: [
			{
				Text: String,
				postedBy: {
					type: ObjectId,
					ref: "User",
				},
			},
		],
	},
	{ timestamps: true }
);

// Create a model from our schema
module.exports = mongoose.model("Post", postSchema);
