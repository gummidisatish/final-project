const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    // console.log("Received Authorization Header:", authHeader); // ✅ Debugging line

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract "Bearer <token>"
    // console.log("Extracted Token:", token); // ✅ Debugging line

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded); // ✅ Debugging line
        req.user = decoded;
        next();
    } catch (error) {
        // console.error("JWT Verification Failed:", error);
        res.status(400).json({ error: "Invalid token" });
    }
};
