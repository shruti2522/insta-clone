
const Post = require("../models/post.model");
const User = require("../models/user.model");

exports.user = (req, res) => {
	User.findOne({ _id: req.params.id })
		.select("-password")
		.then((user) => {
			console.log("user route")
			Post.find({ postedBy: req.params.id })
				.populate("postedBy", "_id username")
				.exec((err, result) => {
					if (err) return res.status(422).json();
					const posts = [];
					result.map((item) => {
						posts.push({
							_id: item._id,
							title: item.title,
							body: item.body,
							photo: item.photo.toString("base64"),
							photoType: item.photoType,
							likes: item.likes,
							comments: item.comments,
							followers: item.followers,
							following: item.following,
						});
					});
					res.json({ user, posts });
				});
		})
		.catch((err) => {
			return res.status(404).json({ Error: "User not found" });
		});
};

exports.follow = (req, res) => {
	User.findByIdAndUpdate(
		req.body.followId,
		{
			$push: { followers: req.user._id },
		},
		{
			new: true,
		},
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			}
			console.log("follow route")
			User.findByIdAndUpdate(
				req.user._id,
				{
					$push: { following: req.body.followId },
				},
				{ new: true }
			)
				.select("-password")
				.then((result) => {
					res.json(result);
				})
				.catch((err) => {
					return res.status(422).json({ error: err });
				});
		}
	);
};

exports.unfollow = (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{
			$pull: { followers: req.user._id },
		},
		{
			new: true,
		},
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			}
			User.findByIdAndUpdate(
				req.user._id,
				{
					$pull: { following: req.body.unfollowId },
				},
				{ new: true }
			)
				.select("-password")
				.then((result) => {
					res.json(result);
				})
				.catch((err) => {
					return res.status(422).json({ error: err });
				});
		}
	);
};

exports.bookmarks = (req, res) => {
	User.find({ _id: req.user._id })
		.select("-password")
		.then((user) => {
			const data = user[0].bookmarks;
			Post.find({ _id: { $in: data } })
				.populate("postedBy", "_id username")
				.then((result) => {
					let bookmark = [];
					result.map((item) => {
						bookmark.push({
							_id: item._id,
							postedBy: item.postedBy,
							title: item.title,
							body: item.body,
							photo: item.photo.toString("base64"),
							photoType: item.photoType,
							likes: item.likes,
							comments: item.comments,
						});
					});
					res.json({ bookmark });
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => {
			return res.status(404).json({ Error: "User not found" });
		});
};

exports.bookmarkPost = (req, res) => {
	User.findByIdAndUpdate(
		req.user._id,
		{
			$push: { bookmarks: req.body.postId },
		},
		{ new: true }
	)
		.select("-password")
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			return res.json({ error: err });
		});
};

exports.removeBookmark = (req, res) => {
	User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { bookmarks: req.body.postId },
		},
		{ new: true }
	)
		.select("-password")
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			return res.json({ error: err });
		});
};

// Just Wrote the logic of it but not yet tested and the client implementation doesn't exist yet
exports.updatePicture = (req, res) => {
	User.findByIdAndUpdate(
		req.user._id,
		{ $set: { photo: req.body.photo, photoType: req.body.photoType } },
		{ new: true },
		(err, result) => {
			if (err) {
				return res.status(422).json({ error: "pic canot post" });
			}
			res.json(result);
		}
	);
};

exports.userSearch = (req, res) => {
	let pattern = new RegExp("^" + req.body.pattern);
	User.find({ username: { $regex: pattern } })
		.select("_id email username")
		.then((user) => {
			res.json({ user });
		})
		.catch((err) => {
			console.log(err);
		});
};
