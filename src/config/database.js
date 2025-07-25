const mongoose = require('mongoose');

const password = encodeURIComponent("Abhih108#");
const uri = 
`mongodb+srv://mallikarjunabhi:${password}@nanastemallikarjun.g48abf1.mongodb.net/?retryWrites=true&w=majority&appName=NanasteMallikarjun`;

async function connectToMongodb (){
    try{
        console.log("connecting to the Mongo DB...");
        await mongoose.connect(uri);
    }
    catch (err){
        console.log("could not connect to the database: ",err.message)
        /*Error needs to be thrown here to prevent the program flow to start listening to client even though databse is not connected*/
        throw err;  
    }
}

module.exports = {connectToMongodb};

