** Nathan Garcia, Kurt Lim 

** CPSC 408 final assignment, baseball tracking app 

**dependencies
"@testing-library/dom": "^10.4.0",
 "@testing-library/jest-dom": "^6.6.3",
"@testing-library/react": "^16.3.0",
"@testing-library/user-event": "^13.5.0",
"papaparse": "^5.5.3",
"react": "^19.1.0",
"react-dom": "^19.1.0",
"react-router-dom": "^7.5.3",
"react-scripts": "^3.0.1",
"web-vitals": "^2.1.4"

**Instructions to run
cd to client then run npm start
cd to server, run node index.js at same time to sync
for baseball_db, use the sql dump 

**overview
tech stack: React, Node.js, CSS, Datagrip, MySQL

app structure:
client: holds all frontend stuff, screens and designs in src componenets, navigation in app.js

server: holds index.js and backend database, and utilizes mvc-inspired layered architecture. Service holds queries and handle core business logic/database operations. Routes hold  API endpoints and HTTP methods. Maps URLs to controller functions. Controllers handle HTTP request/response logic. Validate inputs, call service layer. 


**LLM USAGE
We utilized chatgpt to learn, as well as debug, and help with everything BUT the database and anything we learned from class. The queries we did mostly ourselves besides having to use chat or online to tell us how to make it work with node since its different than the python connector or cursor we did in class. We adhered to guidelines as best as possible but without resources we could not have learned node and frontend without some help
