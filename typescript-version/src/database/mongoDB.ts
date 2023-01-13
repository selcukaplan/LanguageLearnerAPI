


import mongoose from "mongoose";

export default class MongoDB {

    static async connect(mongoURI: string,options: object ={}): Promise<object> {
        let isOptionsEmpty=Object.entries(options).length === 0;
        mongoose.set("strictQuery", false);
        let connectionObject: object;
        if (isOptionsEmpty) {
            connectionObject = await mongoose.connect(mongoURI);
        } else {
            connectionObject = await mongoose.connect(mongoURI,options);
        }
        console.log("Connected to the MongoDB successfully");
        return connectionObject;
    }

}
