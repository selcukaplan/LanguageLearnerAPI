



import  ExpressServer from "./servers/expressServer";

import MongoDB from "./database/mongoDB";


async function startWebBackend(): Promise<any> {
    try {
        const expressServer: ExpressServer = ExpressServer.createServerFromConfig();
        console.log(await MongoDB.connect());
        expressServer.start();
    } catch (error) {
        let errorMessage: string = (error as Error).message;
        console.log(errorMessage);
        process.exit(1);
    }

}

startWebBackend();