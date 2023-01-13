


import mongoose from "mongoose";

export default class MongoDB {

    static async connect(mongoURI: string = process.env.MONGO_URI,options: object ={}): Promise<string> {
        let isOptionsEmpty=Object.entries(options).length === 0;
        mongoose.set("strictQuery", false);
        let connectionObject: object;
        if (isOptionsEmpty) {
            connectionObject = await mongoose.connect(mongoURI);
        } else {
            connectionObject = await mongoose.connect(mongoURI,options);
        }
        return Promise.resolve("connected to MongoDB successfully");
    }

}
