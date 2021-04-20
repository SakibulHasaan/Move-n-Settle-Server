const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT || 4000
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Move-n-Settle Server')
})

console.log('Server is listening on 4000')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfu6f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const ServicesCollection = client.db(`${process.env.DB_NAME}`).collection("Services");
  const OrdersCollection = client.db(`${process.env.DB_NAME}`).collection("Orders");
  const ReviewsCollection = client.db(`${process.env.DB_NAME}`).collection("Reviews");
  console.log("DB Connected");


  app.get('/allServices', (req, res) => {
    ServicesCollection.find()
      .toArray((err, items) => {
        // console.log(items)
        res.send(items);
      })
  });

  app.get('/allReviews', (req, res) => {
    ReviewsCollection.find()
      .toArray((err, items) => {
        // console.log(items)
        res.send(items);
      })
  });

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    ServicesCollection.findOneAndDelete({ _id: id })
      .then(documents => {
        res.send(documents.value);
        console.log("item delete success");
      })
  })

  app.delete('/deleteOrder/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    OrdersCollection.findOneAndDelete({ _id: id })
      .then(documents => {
        res.send(documents.value);
        console.log("item delete success ", id);
      })
  })

  app.get('/orders', (req, res) => {
    OrdersCollection.find()
      .toArray((err, items) => {
        // console.log(items)
        res.send(items);
      })
  });

  app.get('/find/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log(id);
    ServicesCollection.findOne({ "_id": id })
      .then((item) => {
        res.send([item])
        console.log(item)
      })
  });

  app.get('/find/:email', (req, res) => {
    const email = ObjectID(req.params.email);
    console.log(email);
    ServicesCollection.findOne({ "_id": id })
      .then((item) => {
        res.send([item])
        console.log(item)
      })
  });

  app.post('/addAService', (req, res) => {
    const product = req.body;
    ServicesCollection.insertOne(product)
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
    // console.log(product);

  });

  app.post('/order', (req, res) => {
    const product = req.body;
    console.log(product);
    OrdersCollection.insertOne(product)
      .then((result) => {
        console.log(result);
        res.send(result.insertedCount > 0);
      })
  })

});

app.listen(port)