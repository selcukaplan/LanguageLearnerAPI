

const http=require('http');

const {Server} = require('socket.io');

const Message = require("../models/message");

const Conversation=require('../models/conversation');

class ChatServerController {

    #io;
    #server;
    #port;
    static #message = new Message();
    static #conversation=new Conversation();
    #onlineUsers;

    constructor(server,port) {
        this.#io=new Server(server);
        this.#server=server;
        this.#port=port;
        this.#onlineUsers={};
    }

    static createChatServerFromExpress(expressApp,port) {
        let server=http.createServer(expressApp);
        return new ChatServerController(server,port);
    }

    start() {
        this.#server.listen(this.#port,() => {console.log(`listening on port ${this.#port}`)});
        this.#io.on('connection',(webSocket) => this.#connectionHandler(webSocket));
    }

    #addOnlineUser(userId) {
        this.#onlineUsers[userId] = true; // like hash set
    }

    #removeOnlineUser(userId) {
        if (this.#onlineUsers.hasOwnProperty(userId)) {
            delete this.#onlineUsers[userId];
        }
    }


     #connectionHandler(webSocket) {
        const userId=webSocket.handshake.query.userId; // it will webSocket.userId from middleware
        this.#addOnlineUser(userId);
        console.log(`a user whose id = ${userId} is connected`);
        webSocket.on('joinConversation', (conversationId) =>  this.#joinTheConversation(webSocket,conversationId,userId));
        webSocket.on('leaveConversation', (conversationId) =>  this.#lefTheConversation(webSocket,conversationId,userId));
        webSocket.on('sendMessage', (conversationId) =>  this.#sendMessageToConversation(webSocket,conversationId));
         webSocket.on('removeMessage', (conversationId) =>  this.#removeMessageFromConversation(webSocket,conversationId));
        webSocket.on('disconnect', () => this.#removeOnlineUser(userId));
    }



    async #joinTheConversation(webSocket,conversationId,userId) {
        webSocket.join(conversationId);
        const updatedConversation =await ChatServerController.#conversation.addMembersToConversation(conversationId,[userId]);
        if (!updatedConversation) {throw new Error("joining the conversation operation not succeed")} // Todo: will be refactored
        let response =`user whose id = ${userId} join the conversation whose id = ${conversationId}`;
        this.#io.to(conversationId).emit('joinConversation',response);
    }

    async #lefTheConversation(webSocket,conversationId,userId) {
        webSocket.leave(conversationId);
        const updatedConversation =await ChatServerController.#conversation.addMembersToConversation(conversationId,[userId]);
        if (!updatedConversation) {throw new Error("leaving the conversation operation not succeed")} // Todo: will be refactored
        let response =`user whose id = ${userId} left the conversation whose id = ${conversationId}`;
        this.#io.to(conversationId).emit('leaveConversation',response);
    }


    #sendMessageToConversation(webSocket,conversationId,message) {
        //message sending to database
        webSocket.to(conversationId).emit('sendMessage',message);
    }

    #removeMessageFromConversation(webSocket,conversationId,messageId) {
        // remove message from database
        webSocket.to(conversationId).emit('removeMessage',messageId);
    }



}


const express= require('express')();
let chatServer=ChatServerController.createChatServerFromExpress(express,3000);
chatServer.start();

/*

const express= require('express');
const app=express();
let server=http.createServer(app);
const io=new Server(server);
server.listen(3001,() => {
    console.log("listening on *:3001");
})

io.on('connection', (websocket) => console.log("works"));


/*
server.listen(3000,() => {
    console.log("listening on *:3000");
})


let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
*/
