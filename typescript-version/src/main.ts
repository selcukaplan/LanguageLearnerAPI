



import  ExpressServer from "./servers/expressServer";

import errorHandlerMiddleware from "./middlewares/errorHandler";

import MongoDB from "./database/mongoDB";

import userRouter from "./routes/userRouter";

const expressServer: ExpressServer = ExpressServer.createServerFromConfig();

expressServer.bindRequestHandlerToPath('/api/v1/users',userRouter);

expressServer.bindRequestHandler(errorHandlerMiddleware);

async function startWebBackend() {
    try {
        console.log(await MongoDB.connect());
        console.log(await expressServer.start());
    } catch (error) {
        let errorMessage: string = (error as Error).message;
        console.log(errorMessage);
        process.exit(1);
    }
}

startWebBackend();