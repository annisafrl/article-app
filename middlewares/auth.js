const jwt = require('jsonwebtoken');

exports.verifyToken = async function (req, res, next) {
    try {
        if (!req.headers["authorization"] || !req.headers["authorization"].includes("Bearer")) {
            throw new Error("Invalid Token!");
        }
        const jwtToken = req.headers["authorization"].split(" ")[1];
        if (!jwtToken) {
            return res.status(403).json({
                success: false,
                message: "token tidak di temukan."
            })
        }
        const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.decode = decode;
        next();
    } catch (error) {
        // console.log(error)
        if (error.message.indexOf("expired") !== -1) error.message = "Session is Ended! Please Login Again!"
        res.status(403).json({
            success: false,
            message: error.message
        })
    }
}