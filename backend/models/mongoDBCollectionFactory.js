
const mongoose=require('mongoose');
const assert = require("assert");

class MongoDBCollectionFactory {

    // TODO: set methods for collection name
    //  and options will be added
    // TODO: when set methods are called,
    //  schema and model will be created automatically

    #collectionName;

    #collectionOptions;

    #collectionSchema=null;

    #collectionModel=null;

    constructor(collectionName,collectionOptions) {
        this.#collectionOptions=collectionOptions;
        this.#collectionName=collectionName;
        this.#createSchema();
        this.#createModel();
    }

    #createSchema() {
        return new mongoose.Schema(this.#collectionOptions);
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

module.exports = MongoDBCollectionFactory;