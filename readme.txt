#To setup server

npm install express
npm install mongoose

-----------------------------

#To start server

node app.js

-----------------------------

#Database running in local machine

mongodb://127.0.0.1:27017/mydatabase'

-----------------------------

#In the browser, go to

localhost:3000/upload
localhost:3000/list
localhost:3000/query

-----------------------------

#For Bonus Task

players and teams, two collections have been made
Where teams._id = players.teamID
For list and query, populate() function is used to connect and take data from both

-----------------------------