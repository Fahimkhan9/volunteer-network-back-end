const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vigvf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000;

app.use(cors());
app.use(bodyparser.json());

const urlencoded = bodyparser.urlencoded({ extended: false });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//db connection

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("volunteerNetwork").collection("registrations");
  const alldatacollection = client
    .db("volunteerNetwork")
    .collection("allActivityData");

  app.get("/activitydata", (req, res) => {
    alldatacollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addregistrations", urlencoded, (req, res) => {
    const registrationsInfo = req.body;
    collection
      .insertOne(registrationsInfo)
      .then((result) => console.log(result.insertedCount))
      .catch((err) => console.log(err));
  });

  app.get("/getfilteredevents/:id", (req, res) => {
    const id = parseInt(req.params.id);
    alldatacollection.find({ id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.get("/getfilteredevents", (req, res) => {
    const email = req.query.email;
    const covertedemail = email.toString();
    collection.find({ useremail: covertedemail }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.delete("/deleteevents/:id", (req, res) => {
    const id = req.params.id;
    const convertedid = id.toString();
    console.log(convertedid);

    collection.deleteOne({ registeractivityid: convertedid }).then((result) => {
      console.log(result.deletedCount);
    });
  });

  console.log("db connected");
});

app.listen( process.env.PORT || port)
