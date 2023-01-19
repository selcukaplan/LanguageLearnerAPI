
import mongoose, {Schema,Model} from "mongoose"

import assert from 'assert'

export default abstract class MongoDBCollection<DocumentInterface> {

    private collectionName: string;

    private collectionDefinitions: object;

    private collectionOptions: object;

    private collectionSchema: Schema;

    private collectionModel: Model<DocumentInterface>;

    constructor(collectionName: string,collectionDefinitions: object,collectionOptions = {timestamps: true}) {
        this.collectionDefinitions=collectionDefinitions;
        this.collectionOptions=collectionOptions;
        this.collectionName=collectionName;
        this.collectionSchema=this.createSchema();
        this.collectionModel=this.createModel();
    }

    private createSchema() {
        return new Schema<DocumentInterface>(this.collectionDefinitions,this.collectionOptions);
    }

    private createModel() {
        assert(this.collectionSchema," model can not be created if  schema is undefined!");
        const model:Model<DocumentInterface> = mongoose.models[this.collectionName]
            || mongoose.model(this.collectionName,this.collectionSchema)
        // If model exists, It does not create the same model again
        return model;
    }

    /*
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


     */


    getModel() : Model<DocumentInterface> {
        return this.collectionModel;
    }



}