const savePhoto = (post, photoEncoded, photoType) => {
	if (photoEncoded != null) {
		post.photo = new Buffer.from(photoEncoded, "base64");
		post.photoType = photoType;
	}
};

module.exports = { savePhoto };
