
const {UnAuthenticated} = require("../errors")

const jwt = require("jsonwebtoken");

const dotenv=require('dotenv');

const assert = require("assert");

dotenv.config();

function isHeaderValid(authorizationHeader) {
    return (authorizationHeader && authorizationHeader.startsWith('Bearer') &&
        authorizationHeader.split(' ').length >= 2);
}

async function  authenticateTheUserForHTTP(request,response,next) {
    try {
        const {authorization} = request.headers;
        if (!isHeaderValid(authorization)) {
            throw new UnAuthenticated('Authentication Header is invalid!');
        }
        const authorizationArray=authorization.split(' ');
        assert(authorizationArray.length >= 2,"isHeaderValid precondition is not valid!");
        const encryptedToken = authorizationArray[1];
        const userToken = await jwt.verify(encryptedToken, process.env.JWT_SECRET);
        const {userInfo}  = userToken;
        if (!userInfo) {throw new UnAuthenticated('token does not contain user info!')}
        request.user =userInfo;
        next();
    } catch (error) {
        const errorClassName=error.constructor.name;
        if (errorClassName === 'JsonWebTokenError') {
            error=new UnAuthenticated('Token is invalid!');
        }
        next(error);
    }

}

async function authenticateTheUserForWebSocket(webSocket, next) {
    try {
        if (!webSocket.handshake.headers || !webSocket.handshake.headers.token) {
            throw new UnAuthenticated('token not found!')
        }
        const encryptedToken = webSocket.handshake.headers.token;
        const userToken = await jwt.verify(encryptedToken, process.env.JWT_SECRET);
        const {userInfo} = userToken;
        if (!userInfo) {
            throw new UnAuthenticated('token does not contain user info!')
        }
        webSocket.user = userInfo;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {authenticateTheUserForHTTP,authenticateTheUserForWebSocket};