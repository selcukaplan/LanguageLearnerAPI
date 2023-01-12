
import 'dotenv/config';

import mongoose from "mongoose";

class MongoDB {

    static async connect(mongoURI: string,options: object ={}): Promise<string> {
        let isOptionsEmpty=Object.entries(options).length === 0;
        let connectionObject : object;
        if (isOptionsEmpty) {
            connectionObject = await mongoose.connect(mongoURI);
        } else {
            connectionObject = await mongoose.connect(mongoURI,options);
        }
       return 'MongoDB database connection established successfully';
    }

}


