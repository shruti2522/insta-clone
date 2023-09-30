
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
	// Route to handle SignUp requests
	app.post("/signup", controller.signup);

	// Route to handle SignIn requests
	app.post("/signin", controller.signin);

	// Route to handle Reset Passwords requests
	app.post("/reset-pwd", controller.resetPwd);

	// Route to handle Create New Passwords requests
	app.post("/new-pwd", controller.newPwd);
};
