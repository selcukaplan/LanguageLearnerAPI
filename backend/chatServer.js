

const http=require('http');

const {Server} = require('socket.io');

const dotenv=require('dotenv');

const {authenticateTheUserForWebSocket} = require('./middlewares/authentication');

const Message = require("./models/message");

const Conversation = require("./models/conversation");

const defaultPort=process.env.PORT_WEBSOCKET || 8081;

dotenv.config();

//Todo: custom error methods for char server  will be created

//Todo: event names will be enum type

//Todo: generic websocket response object will be created

class ChatServer {

    #io;
    #server;
    #port;
    static #message = new Message();
    static #conversation=new Conversation();
    #onlineUsers;

    constructor(server,port=defaultPort) {
        this.#io=new Server(server);
        this.#server=server;
        this.#port=port;
        this.#onlineUsers={};
    }

    static createChatServerFromExpress(expressApp,port=defaultPort) {
        let server=http.createServer(expressApp);
        return new ChatServer(server,port);
    }

    start() {
        this.#server.listen(this.#port,() => {console.log(`chat server is started for listening on port ${this.#port}`)});
        this.#io.use(authenticateTheUserForWebSocket);
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
        const userId=webSocket.user; // it will webSocket.userId from middleware
        this.#addOnlineUser(userId);
        console.log(`a user whose id = ${userId} is connected`);
        webSocket.on('joinConversation', ({conversationId}) =>  this.#joinTheConversation(webSocket,conversationId,userId));
        webSocket.on('leaveConversation', ({conversationId}) =>  this.#leaveConversation(webSocket,conversationId,userId));
        webSocket.on('sendMessage', ({conversationId,message}) =>  this.#sendMessageToConversation(webSocket,conversationId,userId,message));
        webSocket.on('removeMessage', ({conversationId,messageId}) =>  this.#removeMessageFromConversation(webSocket,conversationId,messageId,userId));
        webSocket.on('onlineUsers', () =>  this.#getOnlineUsers(webSocket));
        webSocket.on('disconnect', () => this.#removeOnlineUser(userId));
    }



    async #joinTheConversation(webSocket,conversationId,userId) {
        webSocket.join(conversationId);
        const updatedConversation =await ChatServer.#conversation.addMembersToConversation(conversationId,[userId]);
        this.#io.to(conversationId).emit('joinConversation',updatedConversation);
    }

    async #leaveConversation(webSocket,conversationId,userId) {
        webSocket.leave(conversationId);
        const updatedConversation =await ChatServer.#conversation.removeMembersFromConversation(conversationId,[userId]);
        this.#io.to(conversationId).emit('leaveConversation',updatedConversation);
    }


    async #sendMessageToConversation(webSocket,conversationId,userId,message) {
       await ChatServer.#message.createMessage(userId,conversationId,message);
        webSocket.to(conversationId).emit('sendMessage',message);
    }

    async #removeMessageFromConversation(webSocket,conversationId,messageId,userId) {
        const removedMessage = await ChatServer.#message.removeMessage(messageId,userId)
        webSocket.to(conversationId).emit('removeMessage',removedMessage);
    }

    async #getOnlineUsers(webSocket) {
        webSocket.emit('onlineUsers',this.#onlineUsers);
    }


}

module.exports = ChatServer

