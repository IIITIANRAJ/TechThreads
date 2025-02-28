const JWT = require("jsonwebtoken");

const secret = "$uperMan@123";
//function to generate token for user
function createTokenForUser(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = JWT.sign(payload,secret);
    return token;
}

//function to validate token of user
function validateToken(token) {
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};

