
const {UnAuthenticated} = require("../errors")

const jwt = require("jsonwebtoken");

const dotenv=require('dotenv');

dotenv.config();

function isHeaderValid(authorizationHeader) {
    return (authorizationHeader && authorizationHeader.startsWith('Bearer') &&
        authorizationHeader.split(' ').length >= 2);
}

async function  authenticateTheUser(request,response,next) {
    try {
        const {authorization} = request.headers;
        if (!isHeaderValid(authorization)) {
            throw new UnAuthenticated('Authentication is invalid!');
        }
        const encryptedToken = authorization.split(' ')[1];
        //TODO: jwt.verify error check will be added
        const userToken = await jwt.verify(encryptedToken, process.env.JWT_SECRET);
        request.user = userToken.userInfo;
        next();
    } catch (error) {
        next(error);
    }

}

module.exports = authenticateTheUser;