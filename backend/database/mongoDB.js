

const mongoose = require('mongoose');

const dotenv=require('dotenv');

const assert=require('assert');

dotenv.config();

class MongoDB {

    static defaultOptions={}

    static mongoURI= process.env.MONGO_URI || "";

    static setOptions(newOptions) {
        MongoDB.defaultOptions=newOptions;
    }

    static async connect(mongoURI =MongoDB.mongoURI, options = MongoDB.defaultOptions) {
        assert(typeof(options) === 'object');
        assert(typeof(mongoURI) === 'string');
        let isOptionsEmpty=Object.entries(options).length === 0;
        let mongoosePromise;
        if (isOptionsEmpty) {
            mongoosePromise = await mongoose.connect(mongoURI);
        } else {
            mongoosePromise = await mongoose.connect(mongoURI,options);
        }
        console.log('MongoDB database connection established successfully');
        return mongoosePromise;
    }

}

module.exports = MongoDB;