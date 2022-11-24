
const mongoDBCollectionFactory=require('mongoDBCollectionFactory');

class User {
    
    static #modelName="User";

    static #userDefinitions = {
        username: {
            // TODO: Index property can be added to decrease complexity
            type:String,
            required:true,
            unique:true,
            minLength: 6
        },
        password: {
            type: String,
            required:true,
            minLength: 6,
        },
        email: {
            type:String,
            required:true,
            unique:true, // TODO: validator will be added
        },
        birthDay: {
            type: Date,
            required:true,
            min:"2004"
        },
        info: {
            type:String,
            default:""
        },
        avatarUrl : {
            type:String,
            default:"/avatarUrls/defaultAvatar.png" // TODO: default image will be added and path could be changed

        },
        nativeLanguage: {
            type: String,
            required:true,
        },
        foreignLanguages: {
            type: Array,
            required:true,
            maxLength: 3, // TODO: for testing
        },
        friends: {
            type:Array,
            maxLength:10, // TODO: for testing
            default:[]
        }
    }

    static #mongoDBCollectionCreater=new mongoDBCollectionFactory(this.#modelName,this.#userDefinitions);

    static getSchema() {
        return User.#mongoDBCollectionCreater.getSchema();
    }

    static getModel() {
        return User.#mongoDBCollectionCreater.getModel();
    }

}

module.exports = User;