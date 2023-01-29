
import {Request,Response,NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import UnAuthenticated from "../errors/unAuthenticated";


export interface AuthenticatedRequest extends Request {
    token: string | JwtPayload;

}

class AuthorizationService {

    static  createToken(userObject :object): string {
        return jwt.sign(userObject, process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_LIFETIME}
        );
    }

    static async  authenticateHTTPRequest(request: Request,response: Response,next: NextFunction) {
        try {
            const encryptedToken = request.header('Authorization')?.replace('Bearer ', '');
            if (!encryptedToken) {
                throw new UnAuthenticated('Authentication Header is invalid!');
            }
            const decryptedToken = jwt.verify(encryptedToken, process.env.JWT_SECRET);
            (request as AuthenticatedRequest).token = decryptedToken
            next();
        } catch (error) {
            const errorClassName=error.constructor.name;
            if (errorClassName === 'JsonWebTokenError') {
                error=new UnAuthenticated('Token is invalid!');
            }
            next(error);
        }

    }

    static async authenticateTheUserForWebSocket(webSocket, next) {
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


}