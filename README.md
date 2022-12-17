# LANGUAGE LEARNER API

##  INTRODUCTION

- Language Learner API is the backend side of the mern stack project that is not completed yet.
- In the application, users will register the system by choosing the foreign languages they want to learn and 
based on their choices they can communicate with the others who choose the same ones. 
- While users are chatting each other, they will be able to see the meanings of the words in their native language 
by hovering over the text.
- Users will be able to comment on other users' profiles.

## STRUCTURE

- Structure of the API was implemented by using express framework in node.js runtime environment.
- It consists of two servers which are called **ExpressServer** and **ChatServer**.
- **ExpressServer** is responsible for handling HTTP requests and responses such as REST API.
- **ChatServer** provides a real-time communication between the users through websocket.
- Both servers are connected to the MongoDB Database.
- Authentication is provided by JWT(JSON Web Token) for both servers.

### IMPROVEMENT NOTES

- **Since the project is still being developed, some reminders and _TODO_ comments could be found in the code.** 
