

const ExpressServer = require('./expressServer.js');

const ChatServer=require("./chatServer.js");

const MongoDB= require("./database/mongoDB");

const errorHandlerMiddleWare=require('./middlewares/errorHandler');

const userRouter=require('./routes/userRouter');

const commentRouter=require("./routes/commentRouter");

const conversationRouter =require("./routes/conversationRouter");

const messageRouter =require("./routes/messageRouter");

const expressServer=ExpressServer.createServerFromConfig();

const chatServer=ChatServer.createChatServerFromExpress(expressServer.getExpressApp());


expressServer.bindRouterMiddlewareToPath('/api/v1/users',userRouter);

expressServer.bindRouterMiddlewareToPath('/api/v1/conversations',conversationRouter);

expressServer.bindRouterMiddlewareToPath('/api/v1/messages',messageRouter);

expressServer.bindRouterMiddlewareToPath('/api/v1/comments',commentRouter);

expressServer.bindMiddleWare(errorHandlerMiddleWare);

async function startWebBackend() {
    try {
        await MongoDB.connect();
        expressServer.start();
        chatServer.start();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }

}

startWebBackend();