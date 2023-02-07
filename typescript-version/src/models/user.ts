




import MongoDBCollection from "./mongoDBcollection";

import { Model,Types} from 'mongoose';

import validator from "validator";

import bcrypt from "bcrypt";

import {Languages} from "./languages";
import UnAuthenticated from "../errors/httpErrors/unAuthenticated";
import BadRequest from "../errors/httpErrors/badRequest";

export interface IUser {
    _id : Types.ObjectId;
    email:string;
    password:string;
    birthDay:Date;
    info:string;
    nativeLanguage:Languages;
    foreignLanguages: Array<Languages>;
    friends: Array<Types.ObjectId>;
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
            enum: Languages,
            required:true,
        },
        foreignLanguages: {
            // Todo: hash set or map could be used to store unique values instead of using array
            type: [String],
            enum: Languages,
            required:true,
            validate : {
                validator : User.isArrayUnique,
                message :"foreign languages must be unique"
            }
        },
        friends: {
            //  Todo: hash set could be used to store unique values instead of using array
            //Todo: user itself id should not be added
            type:[Types.ObjectId], // Todo: unique validator check will be added
            ref: "User"
        }
    }

    constructor(userName=User.userName,userDefinitions = User.userDefinitions) {
        super(userName,userDefinitions);
    }

    static isArrayUnique<T>(arr : Array<T>) : boolean {
       const stringMap: Set<T> = new Set(arr);
       return stringMap.size  === arr.length;
    }


     async signUp (user:IUser): Promise<IUser> {
        try {
            const {email, password} = user;
            if (!email || !password) {
                throw new BadRequest("Email or password is undefined!");
            }
            if (!validator.isEmail(email)) {
                throw new UnAuthenticated('Email is not valid!');
            }
            const userModel: Model<IUser> = this.getModel();
            const userIdObject = await userModel.exists({email});
            if (userIdObject) {
                throw new UnAuthenticated('Email is already used');
            }
            const salt: string = await bcrypt.genSalt(10);
            const hashPassword: string = await bcrypt.hash(password, salt);
            const newUserObject: IUser | null = await userModel.create({...user, password: hashPassword})
            if (!newUserObject) {
                throw new UnAuthenticated('New user could not be created! Please check your user input!');
            }
            return newUserObject;
        } catch (error) {
            let errorName: string = (error as Error).constructor.name;
            if (errorName === "ValidationError") {
                throw new BadRequest((error as Error).message);
            }
            throw error;
        }
    }


    async login( email: string, password: string): Promise<IUser> {
        const userModel:Model<IUser> = this.getModel();
        const userObject: IUser | null = await userModel.findOne({email});
        if (!userObject) {
            throw new UnAuthenticated('Invalid email');
        }
        const hashPassword: string  = userObject.password;
        const isMatch: boolean =await bcrypt.compare(password,hashPassword);
        if (!isMatch) {
            throw new UnAuthenticated('Invalid password');
        }
        return userObject;
    }

    async getUsersWithSameForeignLanguages(currentUserId : string): Promise<Array<IUser>> {
        const currentUser: IUser | null= await this.getModel().findById(currentUserId);
        if (!currentUser) {
            throw new BadRequest('current user is not found!');
        }
        const foreignLanguages = currentUser.foreignLanguages;
        const otherUsers: Array<IUser> = await this.getModel()
            .find({'foreignLanguages' : { $in :  foreignLanguages}, "_id" : { $ne : currentUserId}});

        return otherUsers;

    }

    async getFriends(userId: string): Promise<Array<string>> {
        const userObject : IUser | null = await this.getModel().findById(userId).select("friends");
        if (!userObject) {
            throw new BadRequest("user's friends are not found!");
        }
        const friends=userObject.friends;
        const friendsAsString = friends.map((friendId) => friendId.toString()); // Todo: not good approach
        return friendsAsString;
    }

    async getAllUsers(): Promise<Array<IUser>>{
        const allUsers: Array<IUser> = await this.getModel().find();
        return allUsers;

    }

    async updateUser(userId: string, userBody: object) : Promise<IUser> {
        if (!this.isSubSetOfDefinitions(userBody)) {
            throw new BadRequest('user body is not valid!');
        }
        //Todo: validators not working while updating, must be checked
        const updatedUser : (IUser | null) = await this.getModel().findByIdAndUpdate(userId, userBody,{new : true,runValidators: true});
        if (!updatedUser) {
            throw new BadRequest('user is not updated!');
        }
        return updatedUser;
    }

    async addFriendToUser(userId: string, newFriendId: string) : Promise<IUser> {
        let newFriendId_: Types.ObjectId = new Types.ObjectId(newFriendId);
        // $addToSet is used to add a value to an array unless the value is already present
        const updatedUser : (IUser | null) = await this.getModel()
            .findByIdAndUpdate(userId,{$addToSet: {"friends": newFriendId_}},
                {new : true,runValidators: true});
        if (!updatedUser) {
            throw new BadRequest('friends can not be added to the user');
        }
        return updatedUser;

    }

    async removeFriendFromUser(userId: string, removedFriendId: string) : Promise<IUser> {
        let removeFriendId_: Types.ObjectId = new Types.ObjectId(removedFriendId);
        const updatedUser  : (IUser | null) = await this.getModel().findByIdAndUpdate(userId,
            {$pull : {"friends" : removeFriendId_}}, {new : true,runValidators: true})
        if (!updatedUser) {
            throw new  BadRequest('friends can not be added to the user');
        }
        return updatedUser;
    }


}
