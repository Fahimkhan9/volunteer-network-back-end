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

//db connection

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteerNetwork").collection("registrations");
  const alldatacollection = client.db("volunteerNetwork").collection("allActivityData");
//   app.post("/postalldata",urlencoded,(req,res) => {
//     console.log(req.body);
//     const alldatainfo = req.body
// alldatacollection.insertMany(alldatainfo)
// .then(result => console.log(result.insertedCount))
// .catch(err => console.log(err))

  
//   })
  
  app.get("/getalldata",(req,res )=> {
    alldatacollection.find({})
    .toArray((err,documents) => {
      res.send(documents)
  
    })
  })
    app.post("/addregistrations",urlencoded,(req,res) => {
      console.log(req.body);
      const registrationsInfo = req.body
collection.insertOne(registrationsInfo)
.then(result => console.log(result.insertedCount))
.catch(err => console.log(err))
  
      })
  
  app.get("/getevents",(req,res) => {
    console.log(req.query.email);
    const useremail = req.query.email
   collection.find({email: req.query.email})
   .toArray((err,documents) => {
     res.send(documents)
     console.log(documents);
   })
  })

console.log("db connected");

});










app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
