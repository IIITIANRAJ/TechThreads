const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]; // Use req.cookies instead of req.cookie
        if (!tokenCookieValue) {
            next();
            return; // Make sure to return to prevent code from continuing unnecessarily
        }
        
        try {
            const userPayload = validateToken(tokenCookieValue); // Assuming this function validates the token
            req.user = userPayload; // Assign the user payload to req.user
        } catch (error) {
            console.error("Token validation failed", error);
        }
        next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
