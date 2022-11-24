

const ExpressServer = require('./expressServer.js');

const MongoDB= require("./database/mongoDB");

const expressServer=ExpressServer.createServerFromConfig();

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