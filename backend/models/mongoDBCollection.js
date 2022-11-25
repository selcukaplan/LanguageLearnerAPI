
const mongoose=require('mongoose');
const assert = require("assert");

class MongoDBCollection {

    // TODO: set methods for collection name
    //  and options will be added
    // TODO: when set methods are called,
    //  schema and model will be created automatically

    #collectionName;

    #collectionDefinitions;

    #collectionOptions= {timestamps: true};

    #collectionSchema=null;

    #collectionModel=null;

    constructor(collectionName,collectionDefinitions,collectionOptions={}) {
        this.#collectionDefinitions=collectionDefinitions;
        this.#collectionOptions=collectionOptions;
        this.#collectionName=collectionName;
        this.#createSchema();
        this.#createModel();
    }

    #createSchema() {
        return new mongoose.Schema(this.#collectionDefinitions,this.#collectionOptions);
    }

    #createModel() {
        assert(this.#collectionSchema !== null);
        return new mongoose.model(this.#collectionName,this.#collectionSchema);
    }

    getSchema() {
        return this.#collectionSchema;
    }

    getModel() {
        return this.#collectionModel;
    }

}

module.exports = MongoDBCollection;