const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const generateAcessToken = (id, role) => {
	const payload = {
		id,
		role,
	};
	return jwt.sign(payload, "SECRET_KEY", { expiresIn: "24h" });
};

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: "Registration error", errors });
			}
			const { username, password, role } = req.body;
			const candidate = await User.findOne({ username });
			if (candidate) {
				return res
					.status(400)
					.json({ message: "User with this username already exist" });
			}
			const hashPassword = bcrypt.hashSync(password, 7);
			const userRole = await Role.findOne({ value: role || "USER" });
			if (!userRole) {
				return res.status(400).json({ message: "Registration error" });
			}
			const user = new User({
				username,
				password: hashPassword,
				role: userRole.value,
			});
			await user.save();
			return res.json({ message: "User was created" });
		} catch (e) {
			console.log(e);
			res.status(400).json({ message: "Registration error" });
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ username });
			if (!user) {
				return res.status(400).json({ message: "Incorrect login or password" });
			}
			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(400).json({ message: "Incorrect login or password" });
			}
			const token = generateAcessToken(user._id, user.role);
			return res.json({ token });
		} catch (e) {
			console.log(e);
			res.status(400).json({ message: "Login error" });
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find();
			res.json(users);
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = new authController();
