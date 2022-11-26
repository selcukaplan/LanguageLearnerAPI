

const ExpressServer = require('./expressServer.js');

const MongoDB= require("./database/mongoDB");

const expressServer=ExpressServer.createServerFromConfig();

const UserRouter=require('./routes/userRouter');

expressServer.bindRouterMiddlewareToPath('/api/v1/user',UserRouter.getRouter());

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