

const http=require('http');

const {Server} = require('socket.io');

const jwt = require("jsonwebtoken");

const dotenv=require('dotenv');

const {UnAuthenticated} = require("./errors");

dotenv.config();

const MessageController = require("./controllers/messageController");

const ConversationController=require('./controllers/conversationController');

const defaultPort=process.env.PORT_WEBSOCKET || 8081;


//Todo: custom error methods for char server  will be created

//Todo: event names will be enum type

//Todo: generic websocket response object will be created

class ChatServer {

    #io;
    #server;
    #port;
    static #message = MessageController.getMessage(); //Todo: model will be used
    static #conversation=ConversationController.getConversation(); //Todo: model will be used
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
        this.#server.listen(this.#port,() => {console.log(`chat server listening on port ${this.#port}`)});
        this.#io.use(this.#authenticateTheWebSocket);
        this.#io.on('connection',(webSocket) => this.#connectionHandler(webSocket));

    }

    async #authenticateTheWebSocket(webSocket,next) { // Todo: will be added to the authentication middleware folder
        try {
            if (!webSocket.handshake.headers || !webSocket.handshake.headers.token) {
                throw new UnAuthenticated('token not found!')
            }
            const encryptedToken = webSocket.handshake.headers.token;
            const userToken = await jwt.verify(encryptedToken, process.env.JWT_SECRET);
            const {userInfo} = userToken;
            if (!userInfo) {
                throw new UnAuthenticated('token does not contain user info!')
            }
            webSocket.user = userInfo;
            next();
        } catch (error) {
            next(error);
        }
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

