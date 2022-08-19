const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const {version} = require("./package.json");
const { urlencoded, json } = require ('body-parser');
const { uploader, cloudinaryConfig } = require ('./middlewares/cloudinary');
var cors = require('cors')

app.use(cors())

const APIroutes = require("./routes");

const connectMongoose = "mongodb://127.0.0.1:27017/forumNew"
mongoose.connect(connectMongoose)
.then(res => {
    console.log("database connected.");
}).catch(err => {
    console.log(err);
});

app.use(express.json()); // untuk post body jika tidak ada akan eror req.body

app.use("/api", APIroutes)

app.use(function(err, req, res, next){
    res.status(400).json({
        success: false,
        error: err.message || err
    })
});

//fefine port for backend
const PORT = process.env.PORT || "3000";
app.listen(PORT, () => console.log(`listening on port ${PORT}..`));