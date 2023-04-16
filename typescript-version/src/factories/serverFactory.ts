


import ExpressServer from "../servers/expressServer";
import userRouter from "../routes/userRouter";
import errorHandlerMiddleware from "../middlewares/errorHandler";

export default class ServerFactory {

      public static  createExpressServer(): ExpressServer {
          const expressServer = ExpressServer.createServerFromConfig();
          expressServer.bindRequestHandlerToPath('/api/v1/users',userRouter);
          expressServer.bindRequestHandler(errorHandlerMiddleware);
          return expressServer;

    }

}