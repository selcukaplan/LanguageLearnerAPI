
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
        this.#collectionSchema=this.#createSchema();
        this.#collectionModel=this.#createModel();
    }

    #createSchema() {
        return new mongoose.Schema(this.#collectionDefinitions,this.#collectionOptions);
    }

    #createModel() {
        assert(this.#collectionSchema !== null);
        return new mongoose.model(this.#collectionName,this.#collectionSchema);
    }

    getRequiredDefinitions() {
        const requiredDefinitions={}; // storing like hash set
        for (let currentDefinition in this.#collectionDefinitions) {
            let currentObject=this.#collectionDefinitions[currentDefinition];
            if (currentObject.hasOwnProperty("required") && currentObject["required"] === true) {
                requiredDefinitions[currentDefinition] =  true;
            }
        }
        return requiredDefinitions;
    }

     areKeysMatched(object) {
        let requiredDefinitions= this.getRequiredDefinitions();
        const objectKeys=Object.keys(object);
        if (objectKeys.length !== Object.keys(requiredDefinitions).length) {return false};
        for (let currentKey of objectKeys) {
            if (requiredDefinitions[currentKey]) {
                delete requiredDefinitions[currentKey];
            }
        }
        return Object.keys(requiredDefinitions).length === 0;
    }

    getSchema() {
        return this.#collectionSchema;
    }

    getModel() {
        return this.#collectionModel;
    }


}

module.exports = MongoDBCollection;