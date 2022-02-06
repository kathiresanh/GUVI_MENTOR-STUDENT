const express = require('express')
const app = express()
app.use(express.json())

require('dotenv').config({ path: './secure.env' })
const cors = require('cors');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = process.env.UR;
let options ={
    origin:"*"
}

app.use(cors(options))

// create student
app.post("/createstudent",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("facebook");
        let user = await db.collection("GuviStudent").findOne({email:req.body.email})
        if(user==null){
            let user = await db.collection("GuviStudent").insertOne(req.body)
            connection.close();
            res.json({message:"student added"})
        }else{
            res.json({message:"student email already added"})
        }
    } catch (error) {
        res.json({message:"something wrong"})
    }
})

// Create new mentor
app.post("/creatementor",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("facebook");
        let user = await db.collection("Guvimentor").findOne({email:req.body.email})
        if(user==null){
            let user = await db.collection("Guvimentor").insertOne(req.body)
            connection.close();
            res.json({message:"mentor added"})
        }else{
            res.json({message:"mentor email already added"})
        }
    } catch (error) {
        res.json({message:"something wrong"})
    }
}) 

// assign mentor to particular student

app.post("/assignmentor",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("facebook");
        let user = await db.collection("GuviStudent").findOne({email:req.body.email})
        if(user){
            await db.collection("GuviStudent").findOneAndUpdate({email:req.body.email},{$set:req.body})
            connection.close();
            res.json({message:"mentor details updated "})
        }else{
            res.json({message:"user name incorrect"})
        }
    } catch (error) {
        res.json({message:"something wrong"})
    }
}) 

// show list of all students for particular mentor

app.get("/particularmentor",async function(req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("facebook");
       let user = await db.collection("GuviStudent").find({mentor:req.body.mentor}).toArray();
        if(user.length!==0){
            res.json(user)
        }else{
            res.json("no such mentors are found")
        }
               connection.close();
       
    } catch (error) {
        console.log(error)
    }
})
app.listen(process.env.PORT || 3001)