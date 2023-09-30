
const Post = require("../models/post.model");

exports.allPost = (req, res) => {
	Post.find()
		.populate("postedBy", "_id username")
		.populate("comments.postedBy", "_id username")
		.sort("-createdAt")
		.then((data) => {
			let posts = [];
			data.map((item) => {
				posts.push({
					_id: item._id,
					title: item.title,
					body: item.body,
					postedBy: item.postedBy,
					photo: item.photo.toString("base64"),
					photoType: item.photoType,
					likes: item.likes,
					comments: item.comments,
				});
			});
			res.json({ posts });
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.subPost = (req, res) => {
	Post.find({ postedBy: { $in: req.user.Following } })
		.populate("postedBy", "_id username")
		.populate("comments.postedBy", "_id username")
		// .sort("-createdAt")
		.then((data) => {
			console.log("posts router")
			let posts = [];
			data.map((item) => {
				posts.push({
					_id: item._id,
					title: item.title,
					body: item.body,
					postedBy: item.postedBy,
					photo: item.photo.toString("base64"),
					photoType: item.photoType,
					likes: item.likes,
					comments: item.comments,
				});
			});
			res.json({ posts });
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.myPost = (req, res) => {
	Post.find({ postedBy: req.user._id })
		.populate("postedBy", "_id username")
		.populate("comments.postedBy", "_id username")
		.sort("-createdAt")
		.then((data) => {
			let posts = [];
			data.map((item) => {
				posts.push({
					id: item._id,
					title: item.title,
					body: item.body,
					//postedBy: item.postedBy,
					photo: item.photo.toString("base64"),
					photoType: item.photoType,
					likes: item.likes,
					comments: item.comments,
				});
			});
			res.json({ posts });
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.createPost = (req, res) => {
	const { title, body, photoEncode, photoType } = req.body;
	console.log("create posts")
	if (!title || !body || !photoEncode) {
		return res.json({
			error: "Please submit all the required fields.",
		});
	}
	const post = new Post({
		title: title,
		body: body,
		postedBy: req.user,
	});

	// savephoto(post, photoEncode, photoType);

	if (photoEncode != null) {
		console.log("photo encoded")
		post.photo = new Buffer.from(photoEncode, "base64");
		post.photoType = photoType;
	}

	post.save()
		.then(() => {
			console.log(post)
			console.log("post created successfully!!!!!")
			res.json({ message: "Post created successfully" });
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.like = (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { likes: req.user._id },
		},
		{ new: true }
	)
		.populate("postedBy", "_id username")
		.populate("comments.postedBy", "_id username")
		.exec((err, result) => {
			if (err) return res.status(422).json({ Error: err });
			else {
				res.json({
					_id: result._id,
					title: result.title,
					body: result.body,
					postedBy: result.postedBy,
					photo: result.photo.toString("base64"),
					photoType: result.photoType,
					likes: result.likes,
					comments: result.comments,
				});
			}
		});
};

exports.unlike = (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$pull: { likes: req.user._id },
		},
		{ new: true }
	)
		.populate("postedBy", "_id username")
		.populate("comments.postedBy", "_id username")
		.exec((err, result) => {
			if (err) return res.status(422).json({ Error: err });
			else {
				console.log(result);
				res.json({
					_id: result._id,
					title: result.title,
					body: result.body,
					postedBy: result.postedBy,
					photo: result.photo.toString("base64"),
					photoType: result.photoType,
					likes: result.likes,
					comments: result.comments,
				});
			}
		});
};

exports.comment = (req, res) => {
	const comment = { Text: req.body.text, postedBy: req.user._id };
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { comments: comment },
		},
		{ new: true }
	)
		.populate("comments.postedBy", "_id username")
		.populate("postedBy", "_id username")
		.exec((err, result) => {
			if (err) return res.status(422).json({ Error: err });
			else {
				res.json({
					_id: result._id,
					title: result.title,
					body: result.body,
					postedBy: result.postedBy,
					photo: result.photo.toString("base64"),
					photoType: result.photoType,
					likes: result.likes,
					comments: result.comments,
				});
			}
		});
};

exports.deletePost = (req, res) => {
	Post.findOne({ _id: req.params.postId })
		.populate("postedBy", "_id")
		.exec((err, post) => {
			if (err || !post) return res.status(422).json({ error: err });
			if (post.postedBy._id.toString() === req.user._id.toString()) {
				post.remove()
					.then((result) => {
						res.json(result._id);
					})
					.catch((err) => console.log(err));
			}
		});
};
