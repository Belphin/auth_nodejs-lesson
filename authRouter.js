const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

router.post(
	"/registration",
	[
		check(
			"username",
			"Username must be more than 4 and shorter than 16 characters"
		).isLength({ min: 4, max: 16 }),
		check(
			"password",
			"Password must be more than 4 and shorter than 16 characters"
		).isLength({ min: 4, max: 16 }),
	],
	controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router;
