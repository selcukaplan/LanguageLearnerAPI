
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
            throw new UnAuthenticated('Authentication Header is invalid!');
        }
        const encryptedToken = authorization.split(' ')[1];
        const userToken = await jwt.verify(encryptedToken, process.env.JWT_SECRET);
        request.user = userToken.userInfo; // Todo: does 'userInfo' exist or not,checker could be added
        next();
    } catch (error) {
        const errorClassName=error.constructor.name;
        if (errorClassName === 'JsonWebTokenError') {
            error=new UnAuthenticated('Token is invalid!');
        }
        next(error);
    }

}

module.exports = authenticateTheUser;