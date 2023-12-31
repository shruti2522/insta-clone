
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../models/user.model");

// SignUp Controller
exports.signup = (req, res) => {
	const { firstname, lastname, username, email, password } = req.body;
	// Verifying if one of the fields is Empty
	if (!firstname || !lastname || !username || !password || !email) {
		return res.json({ error: "Please submit all required field" });
	}
	// Else we search the user with the credentials submitted
	User.findOne({ email: email })
		.then((savedUser) => {
			// Verify if the user exist in the DB
			if (savedUser) {
				return res.json({ error: "This Email Is Already Used !" });
			}
			console.log("signup invoked")
			bcrypt.hash(password, 12).then((hashedPwd) => {
				const user = new User({
					firstname: firstname,
					lastname: lastname,
					username: username,
					email: email,
					password: hashedPwd,
				});
				user.save()
					.then((user) => {
						// // after saving the user into DB we send a confirmation email
						// const email = {
						// 	from: "no-reply@insta-clone.com",
						// 	to: user.Email,
						// 	subject: "Your account has been created successfully",
						// 	html: "<h1>Welcome to InstaClone</h1>",
						// };
						// sgMail.send(email);
						console.log(user)
						return res.json({
							success: true,
							message: "Signup successful.Please check your mail to verify your account.",
							data: {
								email: user.email,
							}
						});
					})
					.catch((err) => {
						console.log(err);
					});
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// SignIn Controller
exports.signin = (req, res) => {
	const { email, password } = req.body;
	// Verification for an empty field
	if (!email || !password) {
		return res.json({ error: "Please provide Email or Password" });
	}
	// Check if email exist in our DB
	User.findOne({ email: email })
		.then((savedUser) => {
			if (!savedUser) {
				return res.json({ error: "Invalid Email or Password" });
			}
			bcrypt.compare(password, savedUser.password).then((doMatch) => {
				if (doMatch) {
					console.log("token matched")
					// we will generate the token based on the ID of user
					const token = jwt.sign({_id: savedUser._id }, process.env.JWT_SECRET);
					// retrieve the user info details and send it to the front
					const {_id, firstname, lastname, username, email} = savedUser;
					console.log(savedUser)
					return res.json(
						{
						success: true,
						message: "Login successful.",
						data: {
							user: savedUser,
							token: token
						},
						
					});
				} else {
					return res.json({
						error: "Invalid Email or Password",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Reset Password Controller
exports.resetPwd = (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
		}
		const token = buffer.toString("hex");
		User.findOne({ email: req.body.email }).then((user) => {
			if (!user) {
				console.log("simple check of the error source");
				return res.json({ error: "No User exists with that email" });
			}

			user.resetToken = token;
			user.expirationToken = Date.now() + 600000; // 10min in ms
			user.save().then((result) => {
				// this section will be fully functional after adding the SendGrid API Key
				// in order to use this feature
				// the following is an example of Email template

				// const email = {
				// 	from: "no-reply@insta-clone.com",
				// 	to: user.Email,
				// 	subject: "Password Reset",
				// 	html: `
				//      <p>A request has been made to change the password of your account </p>
				// 	 <h5>click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</h5>
				// 	 <p> Or copy and paste the following link :</p>
				// 	 <h5>"http://localhost:3000/reset/${token}"</h5>
				// 	 <h5>The link is only valid for 10min</h5>
				// 	 <h5>If you weren't the sender of that request , you can just ignore the message</h5>
				//      `,
				// };
				// sgMail.send(email);

				res.json({ message: "check your Email Inbox" });
			});
		});
	});
};

// New Password Controller
exports.newPwd = (req, res) => {
	const password = req.body.password;
	const token = req.body.token;
	User.findOne({ resetToken: token, expirationToken: { $gt: Date.now() } })
		.then((user) => {
			if (!user) {
				return res.status(422).json({ error: "Session expired ! Try Again with a new Request" });
			}
			bcrypt.hash(password, 12).then((HashPwd) => {
				user.password = HashPwd;
				user.resetToken = undefined;
				user.expirationToken = undefined;
				user.save().then((result) => {
					res.json({ message: "Password Updated successfully" });
				});
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
