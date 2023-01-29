




import MongoDBCollection from "./mongoDBcollection";

import { Model,Types} from 'mongoose';

import validator from "validator";

import bcrypt from "bcrypt";


export interface IUser {
    _id : Types.ObjectId;
    email:string;
    password:string;
    birthDay:Date;
    info:string;
    nativeLanguage:string;
    foreignLanguages: Array<string>;
    friends: Array<number>; // Todo: will be converted to Array<Types.ObjectId>
    createdAt:Date;
    updatedAt:Date;

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

     async signUp (user:IUser): Promise<IUser> {
        const {email,password} = user;
        if (!validator.isEmail(email)) {
           throw new Error('Email is not valid!');
        }
        const userModel: Model<IUser> = this.getModel();
        const userIdObject= await userModel.exists({email});
        if (userIdObject) {
            throw new Error('Email is already used');
         }
        const salt: string =await bcrypt.genSalt(10);
        const hashPassword: string=await bcrypt.hash(password,salt);
        const newUserObject: IUser | null = await userModel.create({...user,password : hashPassword})
         if (!newUserObject) {
             throw new Error('New user could not be created! Please check your user input!');
         }
        return newUserObject;
    }

    async login( email: string, password: string): Promise<IUser> {
        const userModel:Model<IUser> = this.getModel();
        const userObject: IUser | null = await userModel.findOne({email});
        if (!userObject) {
            throw new Error('Invalid email');
        }
        const hashPassword: string  = userObject.password;
        const isMatch: boolean =await bcrypt.compare(password,hashPassword);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        return userObject;
    }

    async getUsersWithSameForeignLanguages(currentUserId : number): Promise<Array<IUser>> {
        const currentUser: IUser | null= await this.getModel().findById(currentUserId);
        if (!currentUser) {
            throw new Error('current user is not found!');
        }
        const foreignLanguages = currentUser.foreignLanguages;
        const otherUsers: Array<IUser> = await this.getModel()
            .find({'foreignLanguages' : { $in :  foreignLanguages}, "_id" : { $ne : currentUserId}});

        return otherUsers;

    }

    async getFriends(userId: number): Promise<Array<number>> {
        const userObject : IUser | null = await this.getModel().findById(userId).select("friends");
        if (!userObject) {
            throw new Error("user's friends are not found!");
        }
        const friends=userObject.friends;
        return friends;
    }

    async getAllUsers(): Promise<Array<IUser>>{
        const allUsers: Array<IUser> = await this.getModel().find();
        return allUsers;

    }

    async updateUser(userId: number, userBody: object) : Promise<IUser> {
        if (!this.isSubSetOfDefinitions(userBody)) {
            throw new Error('user body is not valid!');
        }
        const updatedUser : (IUser | null) = await this.getModel().findByIdAndUpdate(userId, userBody,{new : true});
        if (!updatedUser) {
            throw new Error('user is not updated!');
        }
        return updatedUser;
    }

    async addFriendsToUser (userId: number, newFriends : Array<number>) : Promise<IUser> {
        const updatedUser : (IUser | null) = await this.getModel()
            .findByIdAndUpdate(userId,{$push: {"friends": newFriends}},
                {new : true});
        if (!updatedUser) {
            throw new Error('friends can not be added to the user');
        }
        return updatedUser;

    }

    async removeFriendsFromUser(userId : number, removedFriends: Array<number>) : Promise<IUser> {
        const updatedUser  : (IUser | null) = await this.getModel().findByIdAndUpdate(userId,
            {$pull : {"friends" : {$in : removedFriends}}}, {new : true})
        if (!updatedUser) {
            throw new Error('friends can not be added to the user');
        }
        return updatedUser;
    }


}
