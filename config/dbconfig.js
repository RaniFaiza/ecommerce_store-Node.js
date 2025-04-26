const mongooseVar = require('mongoose');

const dbconn = async ()=>{
    try{
        await mongooseVar.connect(process.env.MONGO_URL);
        console.log(`Connected to Mongodb: ${mongooseVar.connection.host}`);
    }
    catch(err){
        console.log(`Mongo Db Error: ${err}`);
    }
}

module.exports = {dbconn};