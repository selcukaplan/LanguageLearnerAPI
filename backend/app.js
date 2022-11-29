

const ExpressServer = require('./expressServer.js');

const MongoDB= require("./database/mongoDB");

const errorHandlerMiddleWare=require('./middlewares/errorHandler');

const userRouter=require('./routes/userRouter');

const expressServer=ExpressServer.createServerFromConfig();


expressServer.bindRouterMiddlewareToPath('/api/v1/users',userRouter);

expressServer.bindMiddleWare(errorHandlerMiddleWare);

async function startWebBackend() {
    try {
        await MongoDB.connect();
        expressServer.start();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }

}

startWebBackend();