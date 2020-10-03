const express = require('express')
const cors = require("cors")
const bodyparser = require("body-parser")
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config()
const app = express()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vigvf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = 5000

app.use(cors())
app.use(bodyparser.json())


const urlencoded = bodyparser.urlencoded({extended: false})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const collection = client.db("volunteerNetwork").collection("registrations");


  app.post("/addregistrations",urlencoded,(req,res) => {
    console.log(req.body);
const registrationsInfo = req.body
collection.insertOne(registrationsInfo)
.then(result => console.log(result.insertedCount))

    })

app.get("/getevents",(req,res) => {
  collection.find({})
  .toArray((err,documents) => {
    res.send(documents)
    console.log(documents);
  })
})


console.log('db connected');
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})