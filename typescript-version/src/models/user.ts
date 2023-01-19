
import MongoDBCollection from "./mongoDBcollection";

import {Document} from 'mongoose';

import validator from "validator";

import bcrypt from "bcrypt";


export interface IUser {
    email:string,
    password:string,
    birthDay:Date,
    info?:string,
    nativeLanguage:string,
    foreignLanguages: Array<string>,
    friends?: Array<number> // Todo: will be converted to Array<Types.ObjectId>

}


export default class User  extends MongoDBCollection<IUser> {
    
    private static userName: string ="User";

    private static userDefinitions: object = {
        email: {
            type:String,
            required:true,
            unique:true,
        },
        password: {
            type: String,
            required:true,
            minLength: 6,
        },
        birthDay: {
            type: Date,
            required:true,
            // Todo: min date will be added
        },
        info: {
            type:String,
            default:""
        },
        nativeLanguage: {
            type: String,
            required:true,
        },
        foreignLanguages: {
            //Todo: foreign languages are unique that's why another data structure like
            // hash set or map must be used to store unique values instead of using array
            type: Array,
            required:true,
        },
        friends: { //TODO: ref will be added for population
            //Todo: friendIds are unique that's why another data structure like
            // hash set must be used to store unique values instead of using array
            type:Array,
            default:[]
        }
    }

    constructor(userName=User.userName,userDefinitions = User.userDefinitions) {
        super(userName,userDefinitions);
    }

     async signUp (user:IUser): Promise<Document<unknown, any, IUser>> {
        const {email,password} = user;
        if (!validator.isEmail(email)) {
           throw new Error('Email is not valid!');
        }
        const userModel = this.getModel();
        const userObject = await userModel.exists({email});
        if (userObject) {
            throw new Error('Email is already used');
         }
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);
        const newUserObject=await userModel.create({...user,password : hashPassword})
         if (!newUserObject) {
             throw new Error('New user could not be created! Please check your user input!');
         }
        return newUserObject;
    }

    async login( user: IUser): Promise< Document<unknown, any, IUser> > {
        const {email,password} = user;
        const userModel = this.getModel();
        const userObject=await userModel.findOne({email});
        if (!userObject) {
            throw new Error('Invalid email');
        }
        const hashPassword = userObject.password;
        const isMatch=await bcrypt.compare(password,hashPassword);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        return userObject;
    }


}
