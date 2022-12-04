
const mongoose=require('mongoose');
const assert = require("assert");

class MongoDBCollection {

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

    isSubSetOfDefinitions(definitionsObject) { //Todo: unnecessary method will be removed
        if (Object.keys(definitionsObject).length === 0) {return false};
        for (let currentDefinition in definitionsObject) {
            if (!this.#collectionDefinitions.hasOwnProperty(currentDefinition)) {
                return false;
            }
        }
        return true;
    }



    getRequiredDefinitionKeys() { //Todo: unnecessary method will be removed
        const requiredDefinitions=[]; // TODO: could be stored as a hash set instead of array
        for (let currentDefinition in this.#collectionDefinitions) {
            let currentObject=this.#collectionDefinitions[currentDefinition];
            if (currentObject.hasOwnProperty("required") && currentObject["required"] !== false) {
                requiredDefinitions.push(currentDefinition);
            }
        }
        return requiredDefinitions;
    }


     areRequiredKeysMatched(object) { //Todo: unnecessary method will be removed
        let requiredDefinitionKeys= this.getRequiredDefinitionKeys().sort(); // TODO: sort algorithm could be improved
        const objectKeys=Object.keys(object).sort();// TODO: sort algorithm could be improved
        return JSON.stringify(requiredDefinitionKeys) === JSON.stringify(objectKeys);
    }

    getModel() {
        return this.#collectionModel;
    }



}

module.exports = MongoDBCollection;