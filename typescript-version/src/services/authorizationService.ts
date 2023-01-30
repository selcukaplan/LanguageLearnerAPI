
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

    static async authenticateTheWebSocket(webSocket: Socket, next: NextFunction) {
        //Todo: custom websocket errors could be created and used instead of http errors.
        try {
            const encryptedToken: string | undefined = (webSocket.handshake.headers?.token) as string;
            if (!encryptedToken) {
                throw new UnAuthenticated('token not found!');
            }
            const payload : string | object = jwt.verify(encryptedToken, process.env.JWT_SECRET!);
            (webSocket as AuthenticatedSocket).payload =payload;
            next();
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                error=new UnAuthenticated('Token is invalid!');
            }
            next(error);
        }
    }

}
