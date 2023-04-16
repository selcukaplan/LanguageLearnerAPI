




import MongoDB from "./database/mongoDB";

import ServerFactory from "./factories/serverFactory";

async function startWebBackend() {
    try {
        const expressServer = ServerFactory.createExpressServer();
        console.log(await MongoDB.connect());
        console.log(await expressServer.start());
    } catch (error) {
        let errorMessage: string = (error as Error).message;
        console.log(errorMessage);
        process.exit(1);
    }
}

startWebBackend();