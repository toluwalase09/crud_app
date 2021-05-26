const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

//declaring the connection string
const connectionString = "mongodb://localhost:27017/payload"

//creating a mongo client instance
const client = new mongoClient(connectionString, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
app.use(express.json())


app.get('/user', (req, res) => {
    client.connect((err, connectedClient) =>{
        if (err) return res.status(500).json({message: err});
        const db = connectedClient.db();
        db.collection("user").find({}).toArray((err, result) =>
        {
            if (err) {
                return res.status(500).json({message: err})  
            }
            return res.status(200).json({message: result});
        })
    
    })    
})

app.post('/user', (req,res) =>{
    client.connect((err, connectedClient) =>{
        if (err) throw err;
        const db = connectedClient.db();
        db.collection("user").insertOne({
            Name: req.body.Name, 
            Email: req.body.Email,
            Country: req.body.Country
        },(err, result) => {
            if (err) {
                return res.status(500).json({message: err});
            }
            return res.status(200).json({message: "new user added"})
        })
    })
})

app.delete('/user',  (req,res) => {
    client.connect((err, connectedClient) =>{
        if (err) throw err;
        const db = connectedClient.db();
        db.collection('user').remove({
            Name: req.body.Name, 
            Email: req.body.Email,
            Country: req.body.Country
        }, (err, user) => {
            if (err){
            return res.status(500).json({message: err});
        }
            return res.status(200).json({message: "user deleted sucessfully"})
        });
    })
});
app.listen(4000, () => console.log("server up and running "))