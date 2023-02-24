const mongoose = require('mongoose');

const connectDb = async () =>{
   try {
         mongoose.set('strictQuery',true)
         await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("MongoDB connected successfully!");
     } catch (error) {
        console.log(err);
        process.exit(1);
     }
}

module.exports = connectDb;