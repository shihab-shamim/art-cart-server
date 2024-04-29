const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware  
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u53e1so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    const artCollection = client.db("artDB").collection("art");

    app.get('/add',async(req,res)=>{
        const query=artCollection.find()
        const result=await query.toArray()
        res.send(result)
    })
    app.get('/add/:id',async(req,res)=>{
        const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await artCollection.findOne(query);
            res.send(result)
    })
    app.post('/add', async (req, res) => {
      const art = req.body;
      console.log(art);
      const result = await artCollection.insertOne(art);
      res.send(result);
    });
    app.delete('/add/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await artCollection.deleteOne(query);
        res.send(result);
    })
    app.put('/add/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedCard = req.body;

        const art = {
            $set: {
                photoURL: updatedCard.photoURL, 
                item_name: updatedCard.item_name, 
                subcategory_name: updatedCard.subcategory_name, 
                price: updatedCard.price, 
                customization: updatedCard.customization, 
                rating: updatedCard.rating, 
                processing_time: updatedCard.processing_time, 
                stockStatus: updatedCard.stockStatus,
                short_discription: updatedCard.short_discription,
            }
        }

        const result = await artCollection.updateOne(filter, art, options);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('client server okk');
});

app.listen(port, () => {
  console.log('server running port:', port);
});
