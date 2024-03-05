const mongoose = require("mongoose");

const connectDb = () => {
    mongoose.connect(process.env.DB_URI).then((dbCon) => {
        console.log(`Mongodb connected with server: ${dbCon.connection.host}`);
    });
}

module.exports = connectDb;
