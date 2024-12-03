// CREATE SERVER
const express = require("express")
const apiServer = express()
const cors = require("cors")
apiServer.use(cors())
apiServer.use(express.json())

// CONNECT TO DB
const mongoose = require("mongoose")

// MongoDB connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,    // Increase this value
  socketTimeoutMS: 60000,     // Increase this value
}

mongoose.connect("mongodb+srv://SpeakeAdmin:yFrTbeI8OfAhDiHj@cluster0.msjx5fw.mongodb.net/speake?retryWrites=true&w=majority", connectionOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

// Use userRoutes and wordRoutes as middleware
const userRoutes = require('./src/routes/userRoutes'); 
const wordRoutes = require('./src/routes/wordRoutes'); 
const courseRoutes = require('./src/routes/courseRoutes'); 

apiServer.use('/users', userRoutes);
apiServer.use('/words', wordRoutes);
apiServer.use('/courses', courseRoutes);

// RUNNING SERVER
apiServer.listen("3001", ()=>{
  console.log(`Server started on port 3001 at ${new Date()}`);
})