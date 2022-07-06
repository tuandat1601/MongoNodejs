const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let database;
 async function connect(){
	 const client  = await MongoClient.connect("mongodb://localhost:27017");
	 database=client.db("blog")
 }
 function getDB(){
	 if(!database){
		throw {message:'Database connection not establish'}
	 }
	 return database
 }
 module.exports={
	 connecToDatabase :connect,
	 getDB:getDB
 }