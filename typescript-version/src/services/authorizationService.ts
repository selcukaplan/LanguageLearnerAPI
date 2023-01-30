
import {Request,Response,NextFunction} from "express";
import jwt, {JsonWebTokenError} from "jsonwebtoken";
import UnAuthenticated from "../errors/httpErrors/unAuthenticated";
import {Socket} from "socket.io";
import "dotenv/config";

export interface AuthenticatedRequest extends Request {
    payload: string | object;

}

export interface AuthenticatedSocket extends Socket {
    payload : string | object;

}

export default class AuthorizationService {

    static  createToken(payload : object | string): string {
        if (typeof payload === "string") {
            // string payloads can not have a lifetime option.
            return jwt.sign(payload,process.env.JWT_SECRET!);
        }

        return jwt.sign(payload, process.env.JWT_SECRET!,
            {expiresIn: process.env.JWT_LIFETIME}
        );
    }

    static async  authenticateHTTPRequest(request: Request,response: Response,next: NextFunction) {
        try {
            const encryptedToken : string | undefined = request.header('Authorization')?.replace('Bearer ', '');
            if (!encryptedToken) {
                throw new UnAuthenticated('Authentication Header is invalid!');
            }
            const payload : object | string = jwt.verify(encryptedToken, process.env.JWT_SECRET!);
            (request as AuthenticatedRequest).payload = payload
            next();
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
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