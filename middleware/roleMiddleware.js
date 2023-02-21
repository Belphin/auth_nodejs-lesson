const jwt = require("jsonwebtoken");

module.exports = function (roles) {
	return function (req, res, next) {
		if (req.method === "OPTIONS") {
			next();
		}
		try {
			const token = req.headers.authorization.split(" ")[1];
			if (!token) {
				return res.status(403).json({ message: "User not authorized" });
			}
			const { role } = jwt.verify(token, "SECRET_KEY");
			let hasRole = false;
			if (roles.includes(role)) {
				hasRole = true;
			}
			if (!hasRole) {
				return res.status(403).json({ message: "You don't have access" });
			}
			next();
		} catch (e) {
			console.log(e);
			return res.status(403).json({ message: "User not authorized" });
		}
	};
};
