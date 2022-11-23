
const express= require('express');

const assert=require('assert');

const dotenv=require('dotenv');

dotenv.config();

const cors=require('cors');

const defaultPort=8000;


class ExpressServer {

    #port;

    #expressApp;

    constructor(port) {
        assert(typeof(port) === 'number',"Port type is not valid");
        this.#expressApp= express();
        this.#port=port;
        this.#bindDefaultMiddleWares();

    }

    static createServerFromConfig() {
        const configPort= Number(process.env.PORT) || defaultPort;
        return new ExpressServer(configPort);
    }

    async #bindDefaultMiddleWares() {
        this.#expressApp.use(express.json());
        this.#expressApp.use(cors());
    }


    async bindMiddleWare(middleWare) {
        this.#expressApp.use(middleWare);

    }

    async bindRouterToPath(path,routerMiddleWare) {
        this.#expressApp.use(path,routerMiddleWare);
    }

    async start() {
        this.#expressApp.listen(this.#port, () => {
            console.log(`app is started for listening on port ${this.#port}`);
        })
    }

}

module.exports= ExpressServer;


