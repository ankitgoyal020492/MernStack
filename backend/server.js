const app = require("./app");
const connectDb = require("./config/database")
const cloudinary = require("cloudinary").v2;
//Handling uncaught exception

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception.`);

    process.exit(1);
})


//Config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({ path: "backend/config/config.env" });
}



//DB Connection
connectDb();

//cloudinary For images
cloudinary.config({ 
  cloud_name:  process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

//Unhandled promise rejection

process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejections.`);

    server.close(() => {
        process.exit();
    })
})