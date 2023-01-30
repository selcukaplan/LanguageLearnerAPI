


import mongoose from "mongoose";

export default class MongoDB {

    static async connect(mongoURI: string = process.env.MONGO_URI,options: object ={}): Promise<string> {
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
