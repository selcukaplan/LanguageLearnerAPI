


import express, {Express,RequestHandler,ErrorRequestHandler} from "express";

import "dotenv/config";

import cors from "cors";

export default class ExpressServer {

    private static  defaultPort=8080;

    private readonly port: number;

    private expressServer: Express;

    constructor(port: number) {
        this.port = port;
        this.expressServer  = express();
        this.bindDefaultMiddleWares();

    }

    public static createServerFromConfig(): ExpressServer {
        const configPort: number= Number(process.env.HTTP_PORT) || ExpressServer.defaultPort;
        return new ExpressServer(configPort);
    }

    private bindDefaultMiddleWares(): void {
        this.expressServer.use(express.json());
        this.expressServer.use(cors());

    }


    bindRequestHandler(requestHandler: RequestHandler | ErrorRequestHandler): void {
        this.expressServer.use(requestHandler);

    }

    bindRequestHandlerToPath(path: string, requestHandler: RequestHandler): void  {
        this.expressServer.use(path,requestHandler);
    }

     async start(): Promise<string> {
        await this.expressServer.listen(this.port);
        return "express server is started for listening on port " +  this.port;
    }

}

