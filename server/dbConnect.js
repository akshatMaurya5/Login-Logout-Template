const mongoose=require('mongoose')

module.exports = async ()=>{
    const mongoURI ="mongodb+srv://user:user@cluster0.wozwqxn.mongodb.net/?retryWrites=true&w=majority";
    
    try {
        const connect = await mongoose.connect(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true,});  

        console.log(`DB connected: ${connect.connection.host}`);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}