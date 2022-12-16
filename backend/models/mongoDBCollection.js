
const mongoose=require('mongoose');
const assert = require("assert");

class MongoDBCollection {

    #collectionName;

    #collectionDefinitions;

    #collectionOptions;

    #collectionSchema=null;

    #collectionModel=null;

    constructor(collectionName,collectionDefinitions,collectionOptions = {timestamps: true}) {
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
        assert(this.#collectionSchema !== null,"model can not be created if  schema is null!");
        // If model exists, It does not create the same model again to prevent the error
        const model= mongoose.models[this.#collectionName] || mongoose.model(this.#collectionName,this.#collectionSchema)
        return model;
    }


    isSubSetOfDefinitions(definitionsObject) {
        if (Object.keys(definitionsObject).length === 0) {return false};
        for (let currentDefinition in definitionsObject) {
            if (!this.#collectionDefinitions.hasOwnProperty(currentDefinition)) {
                return false;
            }
        }
        return true;
    }



    getRequiredDefinitionKeys() {
        const requiredDefinitionKeys=[];
        for (let currentDefinition in this.#collectionDefinitions) {
            let currentDefinitionObject=this.#collectionDefinitions[currentDefinition];
            if (currentDefinitionObject.hasOwnProperty("required")
                && currentDefinitionObject["required"] !== false) {
                requiredDefinitionKeys.push(currentDefinition);
            }
        }
        return requiredDefinitionKeys;
    }


     areRequiredDefinitionKeysMatched(definitionsObject) {
        let requiredDefinitionKeys= this.getRequiredDefinitionKeys().sort(); // TODO: sort algorithm could be improved
        const objectKeys=Object.keys(definitionsObject).sort();// TODO: sort algorithm could be improved
        return JSON.stringify(requiredDefinitionKeys) === JSON.stringify(objectKeys); // Keys are compared
    }

    getModel() {
        return this.#collectionModel;
    }



}

module.exports = MongoDBCollection;