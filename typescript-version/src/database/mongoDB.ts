


import mongoose from "mongoose";

import "dotenv/config";

export default class MongoDB {

    private static default_URI:string =process.env.MONGO_URI || "";

    static async connect(mongoURI: string =MongoDB.default_URI ,options: object ={}): Promise<string> {
        let isOptionsEmpty = Object.entries(options).length === 0;
        mongoose.set("strictQuery", false);
        if (isOptionsEmpty) {
            await mongoose.connect(mongoURI);
        } else {
            await mongoose.connect(mongoURI, options);
        }
        return "MongoDB database connection established successfully!";
    }

}
