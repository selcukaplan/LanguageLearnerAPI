


import express, {Express,RequestHandler} from "express";

import "dotenv/config";

import cors from "cors";

const defaultPort=8080;


export default class ExpressServer {

    private port: number;

    private expressServer: Express;

    constructor(port: number) {
        this.port = port;
        this.expressServer  = express();
        this.bindDefaultMiddleWares();

    }

    public static createServerFromConfig(): ExpressServer {
        const configPort: number= Number(process.env.PORT_HTTP) || defaultPort;
        return new ExpressServer(configPort);
    }

    private bindDefaultMiddleWares(): void {
        this.expressServer.use(express.json());
        this.expressServer.use(cors());

    }


    bindRequestHandler(requestHandler: RequestHandler): void {
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

