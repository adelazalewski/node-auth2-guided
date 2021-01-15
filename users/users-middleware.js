const jwt = require("jsonwebtoken")

const roleScale = ["basic", "admin"]
function restrict(role = "basic") {
	return async (req, res, next) => {
		try {
			// express-session will automatically get the session ID from the cookie
			// header, and check to make sure it's valid and the session for this user exists.
			// if (!req.session || !req.session.user) {
			// 	return res.status(401).json({
			// 		message: "Invalid credentials",
			// 	})
			// }
//const token = req.headers.authorization
//or
const token = req.cookies.token
if(!token) {
	return res.status(401).json({
		message: "invalid credentials"
	})
}

jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
	if(err) {
		return res.status(401).json({
			message: "invalid credentials"
		})
	}
//if(decoded.userRole !== role) {
	//allows admins to access basic routes but not the other was around
	if(role && roleScale.indexOf(decoded.userRole) < roleScale.indexOf(role)) {
		return res.status(403).json({
			message: "sorry you're not an admin. you cant see this page"
		})
	}

	//attach the decoded payload to the request so we can use the data later

	req.token = decoded
	//token has been verified
	next()
})

			
		} catch(err) {
			next(err)
		}
	}
}

module.exports = {
	restrict,
}