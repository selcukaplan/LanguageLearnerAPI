
import 'dotenv/config';

import MongoDB from "./database/mongoDB";

async function start() {
    console.log(await MongoDB.connect(process.env.MONGO_URI));
}

start();